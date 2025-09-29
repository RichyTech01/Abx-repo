// import { useRef, useCallback, useEffect, useState } from 'react';
// import SupportApi from '@/api/SupportApi';

// export interface WebSocketMessage {
//   type: "message" | "typing" | "session_closed" | "agent_joined" | "system";
//   message?: string;
//   attachments?: string[];
//   is_typing?: boolean;
//   sender?: {
//     id: string;
//     name: string;
//     role: "user" | "agent";
//   };
//   timestamp?: string;
// }

// export interface UseChatWebSocketOptions {
//   sessionId: string | null;
//   userId: string;
//   onMessage?: (message: WebSocketMessage) => void;
//   onConnectionChange?: (connected: boolean) => void;
//   onTypingChange?: (isTyping: boolean) => void;
//   onSessionClosed?: () => void;
//   autoReconnect?: boolean;
//   reconnectDelay?: number;
// }

// export const useChatWebSocket = (options: UseChatWebSocketOptions) => {
//   const {
//     sessionId,
//     userId,
//     onMessage,
//     onConnectionChange,
//     onTypingChange,
//     onSessionClosed,
//     autoReconnect = true,
//     reconnectDelay = 3000,
//   } = options;

//   const wsRef = useRef<WebSocket | null>(null);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   const [isConnected, setIsConnected] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   // Clean up function
//   const cleanup = useCallback(() => {
//     if (wsRef.current) {
//       wsRef.current.close(1000, 'Component cleanup');
//       wsRef.current = null;
//     }
    
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//       reconnectTimeoutRef.current = null;
//     }
    
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = null;
//     }
    
//     setIsConnected(false);
//     setConnectionError(null);
//   }, []);

//   // Connect to WebSocket
//   const connect = useCallback(() => {
//     if (!sessionId || !userId) {
//       console.warn('Cannot connect: missing sessionId or userId');
//       return;
//     }

//     if (wsRef.current?.readyState === WebSocket.CONNECTING || 
//         wsRef.current?.readyState === WebSocket.OPEN) {
//       console.log('WebSocket already connecting or connected');
//       return;
//     }

//     cleanup();
    
//     const wsUrl = SupportApi.getWebSocketUrl(sessionId, userId);
//     console.log('Connecting to WebSocket:', wsUrl);
    
//     try {
//       wsRef.current = new WebSocket(wsUrl);

//       wsRef.current.onopen = (event) => {
//         console.log('WebSocket connected successfully');
//         setIsConnected(true);
//         setConnectionError(null);
//         onConnectionChange?.(true);
//       };

//       wsRef.current.onmessage = (event) => {
//         try {
//           const data: WebSocketMessage = JSON.parse(event.data);
//           console.log('WebSocket message received:', data);
          
//           // Handle typing indicator separately
//           if (data.type === 'typing' && data.sender?.role !== 'user') {
//             onTypingChange?.(data.is_typing || false);
//           }
          
//           // Handle session closed
//           if (data.type === 'session_closed') {
//             onSessionClosed?.();
//           }
          
//           onMessage?.(data);
//         } catch (error) {
//           console.error('Failed to parse WebSocket message:', error);
//         }
//       };

//       wsRef.current.onclose = (event) => {
//         console.log('WebSocket disconnected:', event.code, event.reason);
//         const wasConnected = isConnected;
//         setIsConnected(false);
//         onConnectionChange?.(false);
        
//         // Handle different close codes
//         if (event.code === 1000) {
//           // Normal closure - don't reconnect
//           console.log('WebSocket closed normally')
//         }}}})