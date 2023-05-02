import { defineMessages } from 'react-intl'

const learningAchievementMessages = {
  '*': defineMessages({
    morning: { id: 'learningAchievement.*.morning', defaultMessage: '晨型高效能' },
    noon: { id: 'learningAchievement.*.noon', defaultMessage: '午休不浪費' },
    afternoon: { id: 'learningAchievement.*.afternoon', defaultMessage: '午茶配著學' },
    evening: { id: 'learningAchievement.*.evening', defaultMessage: '晚自習充電' },
    midnight: { id: 'learningAchievement.*.midnight', defaultMessage: '夜貓好專注' },
    weekend: { id: 'learningAchievement.*.weekend', defaultMessage: '週末學不厭' },
    updateEveryDay: { id: 'learningAchievement.*.updateEveryDay', defaultMessage: '※Update data at {time} every day' },
    dataCountSince: { id: 'learningAchievement.*.dataCountSince', defaultMessage: '※Data in this part counted since {time}' },
  }),
  InfoCard: defineMessages({
    peices: { id: 'learningAchievement.InfoCard.peices', defaultMessage: 'pcs.' },
    badgesCollected: { id: 'learningAchievement.InfoCard.badgesCollected', defaultMessage: 'badges' },
    totalProgramProgress: { id: 'learningAchievement.InfoCard.medalsCollected', defaultMessage: 'progress' },
  }),
  ProgramSummaryCard: defineMessages({
    programInProgress: {
      id: 'learningAchievement.ProgramSummaryCard.programInProgress',
      defaultMessage: 'Program In Progress',
    },
    programs: { id: 'learningAchievement.ProgramSummaryCard.programs', defaultMessage: 'Programs' },
    totalProgram: { id: 'learningAchievement.ProgramSummaryCard.totalProgram', defaultMessage: 'Total Program' },
    communicationAndExpression: {
      id: 'learningAchievement.ProgramSummaryCard.communicationAndExpression',
      defaultMessage: 'Communication and expression',
    },
    businessLeadership: {
      id: 'learningAchievement.ProgramSummaryCard.businessLeadership',
      defaultMessage: 'Business leadership',
    },
    spiritualGrowth: {
      id: 'learningAchievement.ProgramSummaryCard.spiritualGrowth',
      defaultMessage: 'Spiritual growth',
    },
    professionalismInTheWorkplace: {
      id: 'learningAchievement.ProgramSummaryCard.professionalismInTheWorkplace',
      defaultMessage: 'Professionalism in the workplace',
    },
    entrepreneurshipAndStartingABusiness: {
      id: 'learningAchievement.ProgramSummaryCard.entrepreneurshipAndStartingABusiness',
      defaultMessage: 'Entrepreneurship and starting a business',
    },
    healthAndFamilyWellBeing: {
      id: 'learningAchievement.ProgramSummaryCard.healthAndFamilyWellBeing',
      defaultMessage: 'Health and family well-being',
    },
  }),
  RadarCard: defineMessages({
    learningData: { id: 'learningAchievement.RadarCard.learningData', defaultMessage: 'Learning Data' },
    explore: { id: 'learningAchievement.RadarCard.explore', defaultMessage: 'explore' },
    continuance: { id: 'learningAchievement.RadarCard.continuance', defaultMessage: 'continuance' },
    concentrate: { id: 'learningAchievement.RadarCard.concentrate', defaultMessage: 'concentrate' },
    lessons: { id: 'learningAchievement.RadarCard.lessons', defaultMessage: 'lessons' },
    lessonsCompleted: { id: 'learningAchievement.RadarCard.lessonsCompleted', defaultMessage: 'Lessons Completed' },
    programs: { id: 'learningAchievement.RadarCard.programs', defaultMessage: 'programs' },
    programsCompleted: { id: 'learningAchievement.RadarCard.programsCompleted', defaultMessage: 'Programs Completed' },
    hours: { id: 'learningAchievement.RadarCard.hours', defaultMessage: 'hours' },
    totalHours: { id: 'learningAchievement.RadarCard.totalHours', defaultMessage: 'total hours' },
  }),
  ProgressBarCard: defineMessages({
    learningMarathon: {
      id: 'learningAchievement.ProgressBarCard.learningMarathon',
      defaultMessage: 'Learning Marathon',
    },
    currently: { id: 'learningAchievement.ProgressBarCard.currently', defaultMessage: 'Continuous study: {days} days' },
    siteAverage: { id: 'learningAchievement.ProgressBarCard.siteAverage', defaultMessage: 'Site average: {days} days' },
    siteBest: { id: 'learningAchievement.ProgressBarCard.siteBest', defaultMessage: 'Site best: {days} days' },
    bestRecord: { id: 'learningAchievement.ProgressBarCard.bestRecord', defaultMessage: 'Best Record' },
    days: { id: 'learningAchievement.ProgressBarCard.days', defaultMessage: 'days' },
  }),
  ProgramProgressDetailCard: defineMessages({
    programName: { id: 'learningAchievement.ProgramProgressDetailCard.programName', defaultMessage: 'Progress Name' },
    progress: {
      id: 'learningAchievement.ProgramProgressDetailCard.progress',
      defaultMessage: 'Learning Progress per Program',
    },
    progressRate: { id: 'learningAchievement.ProgramProgressDetailCard.progressRate', defaultMessage: 'Progress Rate' },
    purchaseDate: { id: 'learningAchievement.ProgramProgressDetailCard.purchaseDate', defaultMessage: 'Purchase Date' },
  }),
  BadgeCard: defineMessages({
    badges: { id: 'learningAchievement.BadgeCard.badges', defaultMessage: 'Badges' },
    updateEveryDay: {
      id: 'learningAchievement.BadgeCard.updateEveryDay',
      defaultMessage: '※Update data at {time} every day',
    },
    updateEveryWeek: {
      id: 'learningAchievement.BadgeCard.updateEveryWeek',
      defaultMessage: '※Update data every Monday',
    },
    rule: {
      id: 'learningAchievement.BadgeCard.rule',
      defaultMessage:
        '※Medal acquisition rules: within the specified time period, the cumulative learning time of the last week is more than 60 minutes',
    },
  }),
  Badge: defineMessages({
    badgeCount: { id: 'learningAchievement.Badge.badgeCount', defaultMessage: 'Badge Count' },
    time: { id: 'learningAchievement.Badge.time', defaultMessage: 'pcs.' },
    times: { id: 'learningAchievement.Badge.times', defaultMessage: '{times}' },
    minutes: { id: 'learningAchievement.Badge.minutes', defaultMessage: 'minutes' },
    days: { id: 'learningAchievement.Badge.days', defaultMessage: 'days' },
    completedProgramMin: {
      id: 'learningAchievement.Badge.completedProgramMin',
      defaultMessage: 'Completed Program {mins} mins',
    },
    completedSingleProgramPercent: {
      id: 'learningAchievement.Badge.completedSingleProgramPercent',
      defaultMessage: 'completed Single Program Percent',
    },
    learningMins: { id: 'learningAchievement.Badge.learningMins', defaultMessage: 'learning {mins} mins' },
    cumulativeTimeLastWeek: {
      id: 'learningAchievement.Badge.cumulativeTimeLastWeek',
      defaultMessage: 'learning {mins} mins',
    },
    weeklyTime: { id: 'learningAchievement.Badge.weeklyTime', defaultMessage: '*Every week {startTime} ~ {endTime}' },
    weekend: { id: 'learningAchievement.Badge.weekend', defaultMessage: '*Every weekend' },
    continued: { id: 'learningAchievement.Badge.continued', defaultMessage: 'continued' },
  }),
}

export default learningAchievementMessages
