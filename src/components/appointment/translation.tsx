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
    noCurrentUserId: {
      id: 'appointment.AppointmentCard.noCurrentUserId',
      defaultMessage: '無法獲取當前使用者 id',
    },
    noAppointmentPlan: {
      id: 'appointment.AppointmentCard.noAppointmentPlan',
      defaultMessage: '無法獲取當前預約方案資訊',
    },
    noMeetingInfo: {
      id: 'appointment.AppointmentCard.noMeetingInfo',
      defaultMessage: '無法獲取會議資訊',
    },
    noAppointmentPlanCreator: {
      id: 'appointment.AppointmentCard.noAppointmentPlanCreator',
      defaultMessage: '無法獲取當前方案的主持者資訊',
    },
    noLinkSet: {
      id: 'appointment.AppointmentCard.noLinkSet',
      defaultMessage: '尚未設定連結',
    },
    periodDurationAtMost: {
      id: 'appointment.text.periodDurationAtMost',
      defaultMessage: '諮詢一次 {duration} 分鐘為限',
    },
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
    rescheduleAppointment: {
      id: 'appointment.AppointmentCard.rescheduleAppointment',
      defaultMessage: '更換時段',
    },
    notRescheduleAppointmentPeriod: {
      id: 'appointment.AppointmentCard.notRescheduleAppointmentPeriod',
      defaultMessage: '無可更換的時段',
    },
    rescheduleOriginScheduled: {
      id: 'appointment.AppointmentCard.rescheduleOriginScheduled',
      defaultMessage: '原時段',
    },
    rescheduled: {
      id: 'appointment.AppointmentCard.rescheduled',
      defaultMessage: '更換為：',
    },
    rescheduleSuccess: {
      id: 'appointment.AppointmentCard.rescheduleSuccess',
      defaultMessage: '更換成功',
    },
    rescheduleSuccessAppointmentPlanTitle: {
      id: 'appointment.AppointmentCard.rescheduleSuccessAppointmentPlanTitle',
      defaultMessage: '{title} 已更換時段為',
    },
    rescheduleAppointmentPlanTitle: {
      id: 'appointment.AppointmentCard.rescheduleAppointmentPlanTitle',
      defaultMessage: '更換時段：{title}',
    },
    rescheduleConfirm: { id: 'appointment.AppointmentCard.rescheduleConfirm', defaultMessage: '確定更換' },
    rescheduleCancel: { id: 'appointment.AppointmentCard.rescheduleCancel', defaultMessage: '重選時段' },
    confirm: { id: 'appointment.AppointmentCard.confirm', defaultMessage: '好' },
    confirmCancelAlert: { id: 'appointment.AppointmentCard.confirmCancelAlert', defaultMessage: '確定要取消預約嗎？' },
    confirmCancelNotation: {
      id: 'appointment.AppointmentCard.confirmCancelNotation',
      defaultMessage: '取消預約後將會寄送通知給諮詢老師，並重新開放此時段，若需退費請主動聯繫平台。',
    },
    canceledReason: { id: 'appointment.AppointmentCard.canceledReason', defaultMessage: '取消原因' },
    downloadMeetingRecord: { id: 'appointment.AppointmentCard.downloadMeetingRecord', defaultMessage: '下載錄影' },
  }),
  MultiPeriodCheckoutModal: defineMessages({
    selectTimePeriod: {
      id: 'appointment.MultiPeriodCheckoutModal.selectTimePeriod',
      defaultMessage: 'Select Time Period',
    },
    discountMode: {
      id: 'appointment.MultiPeriodCheckoutModal.discountMode',
      defaultMessage: 'Discount Mode',
    },
    manualSetting: {
      id: 'appointment.MultiPeriodCheckoutModal.manualSetting',
      defaultMessage: 'Manual Setting',
    },
    autoRecommendation: {
      id: 'appointment.MultiPeriodCheckoutModal.autoRecommendation',
      defaultMessage: 'Auto Recommendation',
    },
    coupon: { id: 'appointment.MultiPeriodCheckoutModal.coupon', defaultMessage: 'Coupon' },
    bookingPlan: { id: 'appointment.MultiPeriodCheckoutModal.bookingPlan', defaultMessage: 'Booking Plan' },
  }),
  AppointmentPeriodBlockCalendar: defineMessages({
    noAvailableBookingSlots: {
      id: 'appointment.AppointmentPeriodBlockCalendar.noAvailableBookingSlots',
      defaultMessage: 'There are no booking slots available for this date',
    },
  }),
  AppointmentPeriodCollection: defineMessages({
    selectTimeSlot: {
      id: 'appointment.AppointmentPeriodCollection.selectTimeSlot',
      defaultMessage: 'Select Time Slot',
    },
    switchToGridView: {
      id: 'appointment.AppointmentPeriodCollection.switchToGridView',
      defaultMessage: 'Switch to Grid View',
    },
    switchToCalendarView: {
      id: 'appointment.AppointmentPeriodCollection.switchToCalendarView',
      defaultMessage: 'Switch to Calendar View',
    },
  }),
  AppointmentCollectionTabs: defineMessages({
    clickConfirm: {
      id: 'appointment.AppointmentCollectionTabs.clickConfirm',
      defaultMessage: 'There are courses waiting to be checked out. Would you like to switch to another series?',
    },
    setSelectedPeriodsAlert: {
      id: 'appointment.AppointmentCollectionTabs.setSelectedPeriodsAlert',
      defaultMessage: 'The selected number of classes exceeds the set total.',
    },
    bookNow: {
      id: 'appointment.AppointmentCollectionTabs.bookNow',
      defaultMessage: 'Book Now',
    },
    selected: {
      id: 'appointment.AppointmentCollectionTabs.selected',
      defaultMessage: 'Selected',
    },
    classes: {
      id: 'appointment.AppointmentCollectionTabs.classes',
      defaultMessage: 'Classes',
    },
    priceLabel: {
      id: 'appointment.AppointmentCollectionTabs.priceLabel',
      defaultMessage: 'Every {duration} minutes {price}',
    },
    selectCourse: {
      id: 'appointment.AppointmentCollectionTabs.selectCourse',
      defaultMessage: 'Select Course',
    },
    timezone: {
      id: 'appointment.AppointmentCollectionTabs.timezone',
      defaultMessage: '時間以 {city} (GMT{timezone}) 顯示',
    },
  }),
  AppointmentItem: defineMessages({
    booked: { id: 'appointment.AppointmentItem.booked', defaultMessage: '已預約' },
    bookable: { id: 'appointment.AppointmentItem.bookable', defaultMessage: '可預約' },
    meetingIsFull: { id: 'appointment.AppointmentItem.meetingIsFull', defaultMessage: '已無會議室' },
    closed: { id: 'appointment.AppointmentItem.closed', defaultMessage: '已關閉' },
  }),
}

export default appointmentMessages
