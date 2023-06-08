import { defineMessages } from 'react-intl'

const activityMessages = {
  '*': defineMessages({
    add: { id: 'activity.*.add', defaultMessage: '新增' },
  }),
  ActivitySessionItem: defineMessages({
    attended: { id: 'activity.ActivitySessionItem.attended', defaultMessage: '已簽到' },
    attendNow: { id: 'activity.ActivitySessionItem.attendNow', defaultMessage: '立即簽到' },
    enterLinkPage: { id: 'activity.ActivitySessionItem.enterLinkPage', defaultMessage: '進入直播頁面' },
    add: { id: 'activity.ActivitySessionItem.add', defaultMessage: '新增' },
  }),
  ActivityParticipantMeta: defineMessages({
    remaining: { id: 'activityMessages.ActivityParticipantMeta.remaining', defaultMessage: '剩餘' },
  }),
}

export default activityMessages
