export const checkLearningSystem = (customSetting: string) => {
  const isPushToMemberLearningPage = customSetting ? JSON.parse(customSetting).isShowMemberLearningPage === '1' : false
  const achievementSystemStartTimeForFrontend: string = customSetting
    ? JSON.parse(customSetting).achievementSystemStartTimeForFrontend || '2023/5/15'
    : '2023/5/15'
  const updatedHour = customSetting ? JSON.parse(customSetting).updatedHour || 8 : 8

  return { isStart: isPushToMemberLearningPage, startTime: achievementSystemStartTimeForFrontend, updatedHour }
}
