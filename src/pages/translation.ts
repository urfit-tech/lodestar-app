import { defineMessages } from 'react-intl'

const pageMessages = {
  '*': defineMessages({
    cancel: { id: 'page.*.cancel', defaultMessage: '取消' },
  }),
  // ProgramContentPage
  ProgramContentPage: defineMessages({
    foo: { id: 'page.ProgramContentPage.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramContentPage.bar', defaultMessage: 'Bar Message' },
  }),
  ProgramContentTabs: defineMessages({
    foo: { id: 'page.ProgramContentTabs.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramContentTabs.bar', defaultMessage: 'Bar Message' },
  }),
  // ProgramPage
  ProgramPage: defineMessages({
    foo: { id: 'page.ProgramPage.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramPage.bar', defaultMessage: 'Bar Message' },
  }),
  // JoinPage
  JoinPage: defineMessages({
    title: { id: 'page.JoinPage.title', defaultMessage: 'Join KOLABLE!' },
  }),
  // ProfilePage
  ProfilePage: defineMessages({
    activity: { id: 'page.ProfilePage.activity', defaultMessage: 'Activity' },
    merchandise: { id: 'page.ProfilePage.merchandise', defaultMessage: 'Merchandise' },
    program: { id: 'page.ProfilePage.program', defaultMessage: 'Program' },
    post: { id: 'page.ProfilePage.post', defaultMessage: 'Post' },
    appointment: { id: 'page.ProfilePage.appointment', defaultMessage: 'Appointment' },
    updatedAt: { id: 'page.ProfilePage.updatedAt', defaultMessage: 'Last updated' },
    editProfile: { id: 'page.ProfilePage.editProfile', defaultMessage: 'Edit Profile' },
    customizePage: { id: 'page.ProfilePage.customizePage', defaultMessage: 'Customize Page' },
    addActivity: { id: 'page.ProfilePage.addActivity', defaultMessage: 'New Activity' },
    addProgram: { id: 'page.ProfilePage.addProgram', defaultMessage: 'New Program' },
    addPost: { id: 'page.ProfilePage.addPost', defaultMessage: 'New Post' },
    addMerchandise: { id: 'page.ProfilePage.addMerchandise', defaultMessage: 'New Merchandise' },
    addAppointment: { id: 'page.ProfilePage.addAppointment', defaultMessage: 'New Appointment' },
  }),
}

export default pageMessages
