export const checkLearningSystem = (customSetting: string) => {
  const isPushToMemberLearningPage = customSetting ? JSON.parse(customSetting).isShowMemberLearningPage === '1' : false

  return { isPushToMemberLearningPage }
}
