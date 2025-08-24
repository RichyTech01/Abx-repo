import { View, Text, Modal, Pressable,   } from 'react-native'
import React from 'react'

export default function AddtoCartModal({}) {
  return (
    <Modal visible={GenerateReportModal} onRequestClose={() => setGenerateReportModal(!GenerateReportModal)} animationType="slide" transparent>
      <Pressable className="bg-[#0000004D]/70 z-50 flex-1 justify-end">
        <Pressable className="flex-1 " onPress={() => setGenerateReportModal(!GenerateReportModal)}></Pressable>
       
      </Pressable>
    </Modal>
  )
}