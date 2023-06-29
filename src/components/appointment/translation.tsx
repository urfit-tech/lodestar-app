import { defineMessages } from 'react-intl'

const appointmentMessages = {
  '*': defineMessages({
    save: { id: 'appointment.*.save', defaultMessage: '儲存' },
    cancel: { id: 'appointment.*.cancel', defaultMessage: '取消' },
    back: { id: 'appointment.*.back', defaultMessage: '返回' },
    saveSuccessfully: { id: 'appointment.*.saveSuccessfully', defaultMessage: '儲存成功' },
    finished: { id: 'appointment.*.finished', defaultMessage: '已結束' },
  }),
  AppointmentCard: defineMessages({
    attend: { id: 'appointment.AppointmentCard.attend', defaultMessage: '進入會議' },
    toCalendar: { id: 'appointment.AppointmentCard.toCalendar', defaultMessage: '加入行事曆' },
    appointmentIssue: { id: 'appointment.AppointmentCard.appointmentIssue', defaultMessage: '提問單' },
    appointmentIssueDescription: {
      id: 'appointment.AppointmentCard.appointmentIssueDescription',
      defaultMessage: '建議以 1.  2. 方式點列問題，並適時換行讓老師更容易閱讀，若無問題則填寫「無」',
    },
    appointmentDate: { id: 'appointment.AppointmentCard.appointmentDate', defaultMessage: '諮詢日期' },
    createAppointmentIssue: { id: 'appointment.AppointmentCard.createAppointmentIssue', defaultMessage: '我要提問' },
    appointmentCanceledNotation: {
      id: 'appointment.AppointmentCard.appointmentCanceledNotation',
      defaultMessage: '已於 {time} 取消預約',
    },
    cancelAppointment: { id: 'appointment.AppointmentCard.cancelAppointment', defaultMessage: '取消預約' },
    confirmCancelAlert: { id: 'appointment.AppointmentCard.confirmCancelAlert', defaultMessage: '確定要取消預約嗎？' },
    confirmCancelNotation: {
      id: 'appointment.AppointmentCard.confirmCancelNotation',
      defaultMessage: '取消預約後將會寄送通知給諮詢老師，並重新開放此時段，若需退費請主動聯繫平台。',
    },
    canceledReason: { id: 'appointment.AppointmentCard.canceledReason', defaultMessage: '取消原因' },
  }),
  AppointmentCollectionTabs: defineMessages({
    timezone: {
      id: 'appointment.AppointmentCollectionTabs.timezone',
      defaultMessage: '時間以 {city} (GMT{timezone}) 顯示',
    },
  }),
}

export default appointmentMessages
