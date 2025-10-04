import { useEffect, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToast from '@/utils/showToast';

interface Message {
  id: string;
  text?: string;
  image?: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: string[];
}

interface WebSocketMessage {
  type: 'message' | 'typing' | 'session_closed';
  message?: string;
  attachments?: string[];
  is_typing?: boolean;
  sender?: 'user' | 'agent';
  timestamp?: string;
  agent_name?: string;
  user_id?: string;
  data?: {
    id: string;
    message: string;
    sender_id: string;
    attachments: string[] | Array<{ file_url: string; id: number }>;
    created_at: string;
  };
}

interface UseChatWebSocketProps {
  sessionId: string;
  userId: string;
  onSessionClosed?: () => void;
}

export const useChatWebSocket = ({
  sessionId,
  userId,
  onSessionClosed,
}: UseChatWebSocketProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);
  const maxReconnectAttempts = 5;

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket...');
    clearReconnectTimeout();
    isConnectingRef.current = false;
    
    if (wsRef.current) {
      // Remove event listeners before closing
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, 'User disconnected');
      }
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsReconnecting(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connections
    if (isConnectingRef.current || 
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('Already connecting or connected, skipping...');
      return;
    }

    if (!sessionId || !userId) {
      console.log('Missing sessionId or userId');
      return;
    }

    isConnectingRef.current = true;
    const wsUrl = `wss://chat.afrobasketxpress.uk/ws/support/${sessionId}/${userId}/`;
    console.log('Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) return;
        
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', JSON.stringify(data, null, 2));

          switch (data.type) {
            case 'message':
              // Backend sends messages in 'data' object
              if (data.data && data.data.message !== undefined) {
                const messageData = data.data;
                const isUserMessage = messageData.sender_id === userId;
                
                console.log('Processing message:', {
                  isUserMessage,
                  hasAttachments: !!messageData.attachments,
                  attachmentsLength: messageData.attachments?.length,
                  attachments: messageData.attachments,
                  message: messageData.message
                });
                
                // ONLY add agent messages - user messages are already added optimistically
                if (!isUserMessage) {
                  // Normalize attachments - handle both string[] and object[] formats
                  let normalizedAttachments: string[] | undefined = undefined;
                  
                  if (messageData.attachments && messageData.attachments.length > 0) {
                    normalizedAttachments = messageData.attachments.map((att: any) => {
                      if (typeof att === 'string') {
                        return att;
                      } else if (att && typeof att === 'object' && att.file_url) {
                        return att.file_url;
                      }
                      return null;
                    }).filter((url): url is string => url !== null);
                    
                    console.log('Normalized attachments:', normalizedAttachments);
                  }

                  const newMessage: Message = {
                    id: messageData.id || Date.now().toString(),
                    text: messageData.message || '',
                    isUser: false,
                    timestamp: messageData.created_at ? new Date(messageData.created_at) : new Date(),
                    attachments: normalizedAttachments && normalizedAttachments.length > 0 
                      ? normalizedAttachments 
                      : undefined,
                  };
                  
                  console.log('Adding agent message to state:', newMessage);
                  setMessages((prev) => [...prev, newMessage]);
                  setIsAgentTyping(false);
                } else {
                  console.log('Skipping user message (already added optimistically)');
                }
              } else {
                console.warn('Received message without data object:', data);
              }
              break;

            case 'typing':
              console.log('Typing event received:', {
                user_id: data.user_id,
                is_typing: data.is_typing,
                currentUserId: userId,
                isAgent: data.user_id !== userId
              });
              
              // Check if typing is from agent (not from current user)
              if (data.user_id && data.user_id !== userId) {
                console.log('Setting agent typing to:', data.is_typing);
                setIsAgentTyping(data.is_typing || false);
              } else {
                console.log('Ignoring typing from self');
              }
              break;

            case 'session_closed':
              console.log('Session closed by agent');
              showToast('info', 'Chat session has been closed');
              
              // Clear the stored session ID
              AsyncStorage.removeItem('ChatSessionId').catch(err => 
                console.error('Error clearing session:', err)
              );
              
              // Clear messages
              setMessages([]);
              
              disconnect();
              onSessionClosed?.();
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        if (!isMountedRef.current) return;
        
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
      };

      ws.onclose = (event) => {
        if (!isMountedRef.current) return;

        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        isConnectingRef.current = false;

        // Only attempt reconnection for abnormal closures
        if (event.code !== 1000 && 
            event.code !== 1001 && 
            reconnectAttemptsRef.current < maxReconnectAttempts) {
          
          setIsReconnecting(true);
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          
          clearReconnectTimeout();
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log('Max reconnection attempts reached');
          showToast('error', 'Unable to connect to chat. Please try again later.');
          setIsReconnecting(false);
        } else if (event.code === 1001) {
          // Stream end - likely server issue, don't spam reconnect
          console.log('Server closed connection, not reconnecting');
          setIsReconnecting(false);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      isConnectingRef.current = false;
      setIsConnected(false);
    }
  }, [sessionId, userId, disconnect, onSessionClosed]);

  const sendMessage = useCallback(
    (message: string, attachments: string[] = []) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        showToast('error', 'Not connected to chat. Please wait...');
        return false;
      }

      try {
        const payload: WebSocketMessage = {
          type: 'message',
          message: message.trim(),
          attachments: attachments.length > 0 ? attachments : undefined,
        };

        console.log('Sending message:', payload);
        wsRef.current.send(JSON.stringify(payload));

        // Add message locally for immediate feedback
        const newMessage: Message = {
          id: 'temp-' + Date.now().toString(),
          text: message.trim(),
          isUser: true,
          timestamp: new Date(),
          attachments: attachments.length > 0 ? attachments : undefined,
        };
        setMessages((prev) => [...prev, newMessage]);

        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        showToast('error', 'Failed to send message');
        return false;
      }
    },
    []
  );

  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      const payload: WebSocketMessage = {
        type: 'typing',
        is_typing: isTyping,
      };
      wsRef.current.send(JSON.stringify(payload));
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (sessionId && userId) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      console.log('Component unmounting, cleaning up...');
      isMountedRef.current = false;
      clearReconnectTimeout();
      
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(1000, 'Component unmounted');
        }
        wsRef.current = null;
      }
      
      isConnectingRef.current = false;
    };
  }, [sessionId, userId]); // Only depend on sessionId and userId

  return {
    messages,
    setMessages,
    isConnected,
    isAgentTyping,
    isReconnecting,
    sendMessage,
    sendTypingIndicator,
    disconnect,
  };
};