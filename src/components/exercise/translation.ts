import { defineMessages } from 'react-intl'

const exerciseMessages = {
  '*': defineMessages({
    item: { id: 'exercise.*.start', defaultMessage: '項目' },
    score: { id: 'exercise.*.score', defaultMessage: '分' },
    personalPerformance: { id: 'exercise.*.personalPerformance', defaultMessage: '個人表現' },
    overallAverage: { id: 'exercise.*.overallAverage', defaultMessage: '全體平均' },
  }),
  ExerciseIntroBlock: defineMessages({
    start: { id: 'exercise.ExerciseIntroBlock.start', defaultMessage: '開始進行' },
    unStarted: { id: 'exercise.ExerciseIntroBlock.unStarted', defaultMessage: '尚未開始' },
    expired: { id: 'exercise.ExerciseIntroBlock.expired', defaultMessage: '已過期' },
    duration: { id: 'exercise.ExerciseIntroBlock.duration', defaultMessage: '測驗期間' },
    pass: { id: 'exercise.ExerciseIntroBlock.pass', defaultMessage: '及格' },
    fullScore: { id: 'exercise.ExerciseIntroBlock.fullScore', defaultMessage: '滿分' },
    timeLimit: { id: 'exercise.ExerciseIntroBlock.timeLimit', defaultMessage: '答題時間' },
    retest: { id: 'exercise.ExerciseIntroBlock.retest', defaultMessage: '重新測驗' },
    unlimited: { id: 'exercise.ExerciseIntroBlock.unlimited', defaultMessage: '無限制' },
    limitOnce: { id: 'exercise.ExerciseIntroBlock.limitOnce', defaultMessage: '限 1 次' },
    questionsCount: { id: 'exercise.ExerciseIntroBlock.questionsCount', defaultMessage: '題目數' },
    questionsCountContent: { id: 'exercise.ExerciseIntroBlock.questionsCountContent', defaultMessage: '共 {count} 題' },
    timeLimitContent: { id: 'exercise.ExerciseIntroBlock.timeLimitContent', defaultMessage: '限時 {amount} {unit}內' },
    sec: { id: 'exercise.ExerciseIntroBlock.sec', defaultMessage: '秒' },
    min: { id: 'exercise.ExerciseIntroBlock.min', defaultMessage: '分鐘' },
    hour: { id: 'exercise.ExerciseIntroBlock.hour', defaultMessage: '小時' },
    day: { id: 'exercise.ExerciseIntroBlock.day', defaultMessage: '天' },
    week: { id: 'exercise.ExerciseIntroBlock.week', defaultMessage: '週' },
    month: { id: 'exercise.ExerciseIntroBlock.month', defaultMessage: '月' },
    year: { id: 'exercise.ExerciseIntroBlock.year', defaultMessage: '年' },
    unknownUnit: { id: 'exercise.ExerciseIntroBlock.unknownUnit', defaultMessage: '未知單位' },
  }),
  ExerciseBlock: defineMessages({
    countdown: { id: 'exercise.ExerciseBlock.countdown', defaultMessage: '倒數' },
    notFound: { id: 'exercise.ExerciseBlock.notFound', defaultMessage: '找不到資料' },
    exerciseNoLongerExists: { id: 'exercise.ExerciseBlock.exerciseNoLongerExists', defaultMessage: '題目內容已不存在' },
  }),
  ExerciseResultBlock: defineMessages({
    passingScore: { id: 'exercise.ExerciseResultBlock.passingScore', defaultMessage: '及格分數 {passingScore} 分' },
    score: { id: 'exercise.ExerciseResultBlock.score', defaultMessage: '分數' },
    averageAnswerTime: { id: 'exercise.ExerciseResultBlock.averageAnswerTime', defaultMessage: '平均答題時間' },
    totalTimeSpent: { id: 'exercise.ExerciseResultBlock.totalTimeSpent', defaultMessage: '總花費時間' },
  }),
  ExerciseQuestionBlock: defineMessages({
    spendTime: { id: 'exercise.ExerciseQuestionBlock.spendTime', defaultMessage: '花費時間' },
    averageCorrectRate: { id: 'exercise.ExerciseQuestionBlock.averageCorrectRate', defaultMessage: '平均正確率' },
    prevQuestion: { id: 'exercise.ExerciseQuestionBlock.prevQuestion', defaultMessage: '上一題' },
    nextQuestion: { id: 'exercise.ExerciseQuestionBlock.nextQuestion', defaultMessage: '下一題' },
    submit: { id: 'exercise.ExerciseQuestionBlock.submit', defaultMessage: '送出' },
    showResult: { id: 'exercise.ExerciseQuestionBlock.showResult', defaultMessage: '查看分數' },
    correctAnswer: { id: 'exercise.ExerciseQuestionBlock.correctAnswer', defaultMessage: '答案正確' },
    errorAnswer: { id: 'exercise.ExerciseQuestionBlock.errorAnswer', defaultMessage: '答案錯誤' },
    correct: { id: 'exercise.ExerciseQuestionBlock.correct', defaultMessage: '正解' },
  }),
}

export default exerciseMessages
