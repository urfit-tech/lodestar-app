/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRODUCT_INVENTORY
// ====================================================

export interface GET_PRODUCT_INVENTORY_product_inventory_status {
  __typename: "product_inventory_status";
  product_id: string | null;
  buyable_quantity: any | null;
}

export interface GET_PRODUCT_INVENTORY {
  /**
   * fetch data from the table: "product_inventory_status"
   */
  product_inventory_status: GET_PRODUCT_INVENTORY_product_inventory_status[];
}

export interface GET_PRODUCT_INVENTORYVariables {
  productIds?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_APPOINTMENT_PLAN
// ====================================================

export interface GET_APPOINTMENT_PLAN_appointment_plan_by_pk_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
  name: string;
}

export interface GET_APPOINTMENT_PLAN_appointment_plan_by_pk_appointment_periods {
  __typename: "appointment_period";
  started_at: any | null;
  ended_at: any | null;
  booked: boolean | null;
}

export interface GET_APPOINTMENT_PLAN_appointment_plan_by_pk_creator {
  __typename: "member_public";
  id: string | null;
  abstract: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_APPOINTMENT_PLAN_appointment_plan_by_pk {
  __typename: "appointment_plan";
  id: any;
  title: string;
  description: string | null;
  /**
   * minutes
   */
  duration: any;
  price: any;
  support_locales: any | null;
  /**
   * An object relationship
   */
  currency: GET_APPOINTMENT_PLAN_appointment_plan_by_pk_currency;
  /**
   * An array relationship
   */
  appointment_periods: GET_APPOINTMENT_PLAN_appointment_plan_by_pk_appointment_periods[];
  /**
   * An object relationship
   */
  creator: GET_APPOINTMENT_PLAN_appointment_plan_by_pk_creator | null;
}

export interface GET_APPOINTMENT_PLAN {
  /**
   * fetch data from the table: "appointment_plan" using primary key columns
   */
  appointment_plan_by_pk: GET_APPOINTMENT_PLAN_appointment_plan_by_pk | null;
}

export interface GET_APPOINTMENT_PLANVariables {
  appointmentPlanId: any;
  startedAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION
// ====================================================

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_plans {
  __typename: "program_package_plan";
  id: any;
  title: string;
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs_program_program_plans_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
  name: string;
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs_program_program_plans {
  __typename: "program_plan";
  id: any;
  title: string;
  /**
   * An object relationship
   */
  currency: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs_program_program_plans_currency;
  list_price: any;
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs_program {
  __typename: "program";
  id: any;
  cover_url: string | null;
  title: string;
  /**
   * An array relationship
   */
  program_plans: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs_program_program_plans[];
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs {
  __typename: "program_package_program";
  id: any;
  position: number;
  /**
   * An object relationship
   */
  program: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs_program;
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk {
  __typename: "program_package";
  id: any;
  title: string;
  /**
   * An array relationship
   */
  program_package_plans: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_plans[];
  /**
   * An array relationship
   */
  program_package_programs: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk_program_package_programs[];
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION {
  /**
   * fetch data from the table: "program_package" using primary key columns
   */
  program_package_by_pk: GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION_program_package_by_pk | null;
}

export interface GET_PROGRAM_PACKAGE_PROGRAM_COLLECTIONVariables {
  programPackageId: any;
  periodAmount: any;
  periodType: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MANAGEMENT_DOMAIN
// ====================================================

export interface GET_MANAGEMENT_DOMAIN_app_admin {
  __typename: "app_admin";
  host: string;
}

export interface GET_MANAGEMENT_DOMAIN {
  /**
   * fetch data from the table: "app_admin"
   */
  app_admin: GET_MANAGEMENT_DOMAIN_app_admin[];
}

export interface GET_MANAGEMENT_DOMAINVariables {
  appId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_ISSUE_STATUS
// ====================================================

export interface UPDATE_ISSUE_STATUS_update_issue {
  __typename: "issue_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_ISSUE_STATUS {
  /**
   * update data of the table: "issue"
   */
  update_issue: UPDATE_ISSUE_STATUS_update_issue | null;
}

export interface UPDATE_ISSUE_STATUSVariables {
  issueId: any;
  solvedAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_ISSUE
// ====================================================

export interface INSERT_ISSUE_insert_issue {
  __typename: "issue_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_ISSUE {
  /**
   * insert data into the table: "issue"
   */
  insert_issue: INSERT_ISSUE_insert_issue | null;
}

export interface INSERT_ISSUEVariables {
  appId: string;
  memberId: string;
  threadId: string;
  title?: string | null;
  description?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MERCHANDISE_TYPE_COLLECTION
// ====================================================

export interface GET_MERCHANDISE_TYPE_COLLECTION_merchandise_spec_merchandise {
  __typename: "merchandise";
  id: any;
  is_physical: boolean;
  is_customized: boolean;
}

export interface GET_MERCHANDISE_TYPE_COLLECTION_merchandise_spec {
  __typename: "merchandise_spec";
  id: any;
  /**
   * An object relationship
   */
  merchandise: GET_MERCHANDISE_TYPE_COLLECTION_merchandise_spec_merchandise;
}

export interface GET_MERCHANDISE_TYPE_COLLECTION {
  /**
   * fetch data from the table: "merchandise_spec"
   */
  merchandise_spec: GET_MERCHANDISE_TYPE_COLLECTION_merchandise_spec[];
}

export interface GET_MERCHANDISE_TYPE_COLLECTIONVariables {
  merchandiseSpecIds: any[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ORDER_CONTACT
// ====================================================

export interface GET_ORDER_CONTACT_order_contact_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  picture_url: string | null;
}

export interface GET_ORDER_CONTACT_order_contact {
  __typename: "order_contact";
  id: any;
  message: string;
  created_at: any;
  read_at: any | null;
  /**
   * An object relationship
   */
  member: GET_ORDER_CONTACT_order_contact_member | null;
}

export interface GET_ORDER_CONTACT_order_contact_aggregate_aggregate_max {
  __typename: "order_contact_max_fields";
  created_at: any | null;
  read_at: any | null;
}

export interface GET_ORDER_CONTACT_order_contact_aggregate_aggregate {
  __typename: "order_contact_aggregate_fields";
  max: GET_ORDER_CONTACT_order_contact_aggregate_aggregate_max | null;
}

export interface GET_ORDER_CONTACT_order_contact_aggregate {
  __typename: "order_contact_aggregate";
  aggregate: GET_ORDER_CONTACT_order_contact_aggregate_aggregate | null;
}

export interface GET_ORDER_CONTACT {
  /**
   * fetch data from the table: "order_contact"
   */
  order_contact: GET_ORDER_CONTACT_order_contact[];
  /**
   * fetch aggregated fields from the table: "order_contact"
   */
  order_contact_aggregate: GET_ORDER_CONTACT_order_contact_aggregate;
}

export interface GET_ORDER_CONTACTVariables {
  orderId: string;
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_ORDER_CONTACT
// ====================================================

export interface INSERT_ORDER_CONTACT_insert_order_contact {
  __typename: "order_contact_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_ORDER_CONTACT {
  /**
   * insert data into the table: "order_contact"
   */
  insert_order_contact: INSERT_ORDER_CONTACT_insert_order_contact | null;
}

export interface INSERT_ORDER_CONTACTVariables {
  orderId: string;
  memberId: string;
  message: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_ORDER_CONTACT_READ_AT
// ====================================================

export interface UPDATE_ORDER_CONTACT_READ_AT_update_order_contact {
  __typename: "order_contact_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_ORDER_CONTACT_READ_AT {
  /**
   * update data of the table: "order_contact"
   */
  update_order_contact: UPDATE_ORDER_CONTACT_READ_AT_update_order_contact | null;
}

export interface UPDATE_ORDER_CONTACT_READ_ATVariables {
  orderId: string;
  memberId: string;
  readAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MERCHANDISE_SPEC
// ====================================================

export interface GET_MERCHANDISE_SPEC_merchandise_spec_by_pk_merchandise_spec_files {
  __typename: "merchandise_spec_file";
  id: any;
  data: any | null;
}

export interface GET_MERCHANDISE_SPEC_merchandise_spec_by_pk_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
}

export interface GET_MERCHANDISE_SPEC_merchandise_spec_by_pk_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  is_physical: boolean;
  /**
   * An array relationship
   */
  merchandise_imgs: GET_MERCHANDISE_SPEC_merchandise_spec_by_pk_merchandise_merchandise_imgs[];
}

export interface GET_MERCHANDISE_SPEC_merchandise_spec_by_pk {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  /**
   * An array relationship
   */
  merchandise_spec_files: GET_MERCHANDISE_SPEC_merchandise_spec_by_pk_merchandise_spec_files[];
  /**
   * An object relationship
   */
  merchandise: GET_MERCHANDISE_SPEC_merchandise_spec_by_pk_merchandise;
}

export interface GET_MERCHANDISE_SPEC {
  /**
   * fetch data from the table: "merchandise_spec" using primary key columns
   */
  merchandise_spec_by_pk: GET_MERCHANDISE_SPEC_merchandise_spec_by_pk | null;
}

export interface GET_MERCHANDISE_SPECVariables {
  merchandiseSpecId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: READ_ALL_NOTIFICATIONS
// ====================================================

export interface READ_ALL_NOTIFICATIONS_update_notification {
  __typename: "notification_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface READ_ALL_NOTIFICATIONS {
  /**
   * update data of the table: "notification"
   */
  update_notification: READ_ALL_NOTIFICATIONS_update_notification | null;
}

export interface READ_ALL_NOTIFICATIONSVariables {
  readAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: READ_NOTIFICATION
// ====================================================

export interface READ_NOTIFICATION_update_notification {
  __typename: "notification_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface READ_NOTIFICATION {
  /**
   * update data of the table: "notification"
   */
  update_notification: READ_NOTIFICATION_update_notification | null;
}

export interface READ_NOTIFICATIONVariables {
  notificationId: any;
  readAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROGRAM_PACKAGES
// ====================================================

export interface GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs_program_program_content_sections_program_contents {
  __typename: "program_content";
  id: any;
  /**
   * sec
   */
  duration: any | null;
}

export interface GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs_program_program_content_sections {
  __typename: "program_content_section";
  id: any;
  /**
   * An array relationship
   */
  program_contents: GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs_program_program_content_sections_program_contents[];
}

export interface GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs_program {
  __typename: "program";
  id: any;
  /**
   * An array relationship
   */
  program_content_sections: GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs_program_program_content_sections[];
}

export interface GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs {
  __typename: "program_package_program";
  id: any;
  /**
   * An object relationship
   */
  program: GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs_program;
}

export interface GET_ENROLLED_PROGRAM_PACKAGES_program_package {
  __typename: "program_package";
  id: any;
  cover_url: string | null;
  title: string;
  published_at: any | null;
  /**
   * An array relationship
   */
  program_package_programs: GET_ENROLLED_PROGRAM_PACKAGES_program_package_program_package_programs[];
}

export interface GET_ENROLLED_PROGRAM_PACKAGES {
  /**
   * fetch data from the table: "program_package"
   */
  program_package: GET_ENROLLED_PROGRAM_PACKAGES_program_package[];
}

export interface GET_ENROLLED_PROGRAM_PACKAGESVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER_CREDIT_CARDS
// ====================================================

export interface GET_MEMBER_CREDIT_CARDS_member_card {
  __typename: "member_card";
  id: string;
  card_identifier: string;
  card_info: any;
  card_holder: any | null;
}

export interface GET_MEMBER_CREDIT_CARDS {
  /**
   * fetch data from the table: "member_card"
   */
  member_card: GET_MEMBER_CREDIT_CARDS_member_card[];
}

export interface GET_MEMBER_CREDIT_CARDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_ATTACHMENTS
// ====================================================

export interface DELETE_ATTACHMENTS_update_attachment {
  __typename: "attachment_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ATTACHMENTS {
  /**
   * update data of the table: "attachment"
   */
  update_attachment: DELETE_ATTACHMENTS_update_attachment | null;
}

export interface DELETE_ATTACHMENTSVariables {
  attachmentIds: any[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_SUGGESTION
// ====================================================

export interface INSERT_SUGGESTION_insert_issue {
  __typename: "issue_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_SUGGESTION {
  /**
   * insert data into the table: "issue"
   */
  insert_issue: INSERT_SUGGESTION_insert_issue | null;
}

export interface INSERT_SUGGESTIONVariables {
  appId: string;
  memberId: string;
  threadId: string;
  title?: string | null;
  description?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_CONTENT_TRIAL
// ====================================================

export interface GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk_program_content_section_program {
  __typename: "program";
  id: any;
  title: string;
}

export interface GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk_program_content_section {
  __typename: "program_content_section";
  id: any;
  /**
   * An object relationship
   */
  program: GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk_program_content_section_program;
}

export interface GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk_program_content_body {
  __typename: "program_content_body";
  id: any;
  data: any | null;
}

export interface GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk {
  __typename: "program_content";
  id: any;
  title: string;
  /**
   * An object relationship
   */
  program_content_section: GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk_program_content_section;
  /**
   * An object relationship
   */
  program_content_body: GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk_program_content_body;
}

export interface GET_PROGRAM_CONTENT_TRIAL {
  /**
   * fetch data from the table: "program_content" using primary key columns
   */
  program_content_by_pk: GET_PROGRAM_CONTENT_TRIAL_program_content_by_pk | null;
}

export interface GET_PROGRAM_CONTENT_TRIALVariables {
  programContentId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PRIVATE_TEACH_PROGRAMS
// ====================================================

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan_program_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan_program_program_categories {
  __typename: "program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan_program_program_categories_category;
}

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan_program {
  __typename: "program";
  id: any;
  title: string;
  cover_url: string | null;
  /**
   * An array relationship
   */
  program_categories: GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan_program_program_categories[];
}

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan {
  __typename: "program_plan";
  id: any;
  /**
   * An object relationship
   */
  program: GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan_program;
}

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment {
  __typename: "program_plan_enrollment";
  started_at: any | null;
  ended_at: any | null;
  options: any | null;
  /**
   * An object relationship
   */
  program_plan: GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment_program_plan | null;
}

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMS {
  /**
   * fetch data from the table: "program_plan_enrollment"
   */
  program_plan_enrollment: GET_ENROLLED_PRIVATE_TEACH_PROGRAMS_program_plan_enrollment[];
}

export interface GET_ENROLLED_PRIVATE_TEACH_PROGRAMSVariables {
  memberId: string;
  programCategory: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_ID_BY_TITLE
// ====================================================

export interface GET_PROGRAM_ID_BY_TITLE_program {
  __typename: "program";
  id: any;
  title: string;
}

export interface GET_PROGRAM_ID_BY_TITLE {
  /**
   * fetch data from the table: "program"
   */
  program: GET_PROGRAM_ID_BY_TITLE_program[];
}

export interface GET_PROGRAM_ID_BY_TITLEVariables {
  programCategory: string;
  searchText: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_PACKAGE_ID_BY_TITLE
// ====================================================

export interface GET_PROGRAM_PACKAGE_ID_BY_TITLE_program_package {
  __typename: "program_package";
  id: any;
  title: string;
}

export interface GET_PROGRAM_PACKAGE_ID_BY_TITLE {
  /**
   * fetch data from the table: "program_package"
   */
  program_package: GET_PROGRAM_PACKAGE_ID_BY_TITLE_program_package[];
}

export interface GET_PROGRAM_PACKAGE_ID_BY_TITLEVariables {
  programPackageCategory: string;
  searchText: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_APPOINTMENT_PLANS_ID
// ====================================================

export interface GET_APPOINTMENT_PLANS_ID_appointment_plan_creator {
  __typename: "member_public";
  id: string | null;
  name: string | null;
}

export interface GET_APPOINTMENT_PLANS_ID_appointment_plan {
  __typename: "appointment_plan";
  id: any;
  title: string;
  /**
   * An object relationship
   */
  creator: GET_APPOINTMENT_PLANS_ID_appointment_plan_creator | null;
}

export interface GET_APPOINTMENT_PLANS_ID {
  /**
   * fetch data from the table: "appointment_plan"
   */
  appointment_plan: GET_APPOINTMENT_PLANS_ID_appointment_plan[];
}

export interface GET_APPOINTMENT_PLANS_IDVariables {
  searchText: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_COIN_PROJECT_PLANS
// ====================================================

export interface GET_ENROLLED_COIN_PROJECT_PLANS_project_plan_enrollment_project_plan {
  __typename: "project_plan";
  id: any;
  title: string;
  period_amount: any | null;
  /**
   * Y / M / W / D
   */
  period_type: string | null;
}

export interface GET_ENROLLED_COIN_PROJECT_PLANS_project_plan_enrollment {
  __typename: "project_plan_enrollment";
  /**
   * An object relationship
   */
  project_plan: GET_ENROLLED_COIN_PROJECT_PLANS_project_plan_enrollment_project_plan | null;
}

export interface GET_ENROLLED_COIN_PROJECT_PLANS {
  /**
   * fetch data from the table: "project_plan_enrollment"
   */
  project_plan_enrollment: GET_ENROLLED_COIN_PROJECT_PLANS_project_plan_enrollment[];
}

export interface GET_ENROLLED_COIN_PROJECT_PLANSVariables {
  memberId: string;
  projectId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT
// ====================================================

export interface GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT_project_plan_enrollment {
  __typename: "project_plan_enrollment";
  member_id: string | null;
}

export interface GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT {
  /**
   * fetch data from the table: "project_plan_enrollment"
   */
  project_plan_enrollment: GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT_project_plan_enrollment[];
}

export interface GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENTVariables {
  projectId: any;
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_REVIEW_ADMIN
// ====================================================

export interface GET_REVIEW_ADMIN_review_aggregate_aggregate {
  __typename: "review_aggregate_fields";
  count: number | null;
}

export interface GET_REVIEW_ADMIN_review_aggregate {
  __typename: "review_aggregate";
  aggregate: GET_REVIEW_ADMIN_review_aggregate_aggregate | null;
}

export interface GET_REVIEW_ADMIN_review_review_replies_member {
  __typename: "member_public";
  id: string | null;
  role: string | null;
}

export interface GET_REVIEW_ADMIN_review_review_replies {
  __typename: "review_reply";
  id: any;
  content: string | null;
  created_at: any;
  updated_at: any;
  /**
   * An object relationship
   */
  member: GET_REVIEW_ADMIN_review_review_replies_member | null;
}

export interface GET_REVIEW_ADMIN_review {
  __typename: "review";
  id: any;
  member_id: string;
  score: any;
  title: string;
  updated_at: any;
  created_at: any;
  content: string | null;
  private_content: string | null;
  /**
   * An array relationship
   */
  review_replies: GET_REVIEW_ADMIN_review_review_replies[];
}

export interface GET_REVIEW_ADMIN {
  /**
   * fetch aggregated fields from the table: "review"
   */
  review_aggregate: GET_REVIEW_ADMIN_review_aggregate;
  /**
   * fetch data from the table: "review"
   */
  review: GET_REVIEW_ADMIN_review[];
}

export interface GET_REVIEW_ADMINVariables {
  condition?: review_bool_exp | null;
  limit: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_MEMBERS
// ====================================================

export interface GET_ENROLLED_MEMBERS_program_enrollment {
  __typename: "program_enrollment";
  member_id: string | null;
}

export interface GET_ENROLLED_MEMBERS_program_plan_enrollment {
  __typename: "program_plan_enrollment";
  member_id: string | null;
}

export interface GET_ENROLLED_MEMBERS {
  /**
   * fetch data from the table: "program_enrollment"
   */
  program_enrollment: GET_ENROLLED_MEMBERS_program_enrollment[];
  /**
   * fetch data from the table: "program_plan_enrollment"
   */
  program_plan_enrollment: GET_ENROLLED_MEMBERS_program_plan_enrollment[];
}

export interface GET_ENROLLED_MEMBERSVariables {
  targetId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_CURRENT_MEMBER_REVIEW
// ====================================================

export interface GET_CURRENT_MEMBER_REVIEW_review {
  __typename: "review";
  id: any;
  member_id: string;
  score: any;
  title: string;
  content: string | null;
  private_content: string | null;
}

export interface GET_CURRENT_MEMBER_REVIEW {
  /**
   * fetch data from the table: "review"
   */
  review: GET_CURRENT_MEMBER_REVIEW_review[];
}

export interface GET_CURRENT_MEMBER_REVIEWVariables {
  currentMemberId?: string | null;
  path?: string | null;
  appId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_REVIEW_REPLY
// ====================================================

export interface INSERT_REVIEW_REPLY_insert_review_reply {
  __typename: "review_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_REVIEW_REPLY {
  /**
   * insert data into the table: "review_reply"
   */
  insert_review_reply: INSERT_REVIEW_REPLY_insert_review_reply | null;
}

export interface INSERT_REVIEW_REPLYVariables {
  reviewId?: any | null;
  memberId?: string | null;
  content?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_REVIEW_MEMBER
// ====================================================

export interface GET_REVIEW_MEMBER_review_public_aggregate_aggregate {
  __typename: "review_public_aggregate_fields";
  count: number | null;
}

export interface GET_REVIEW_MEMBER_review_public_aggregate {
  __typename: "review_public_aggregate";
  aggregate: GET_REVIEW_MEMBER_review_public_aggregate_aggregate | null;
}

export interface GET_REVIEW_MEMBER_review_public_review_replies_member {
  __typename: "member_public";
  id: string | null;
  role: string | null;
}

export interface GET_REVIEW_MEMBER_review_public_review_replies {
  __typename: "review_reply";
  id: any;
  content: string | null;
  created_at: any;
  updated_at: any;
  /**
   * An object relationship
   */
  member: GET_REVIEW_MEMBER_review_public_review_replies_member | null;
}

export interface GET_REVIEW_MEMBER_review_public {
  __typename: "review_public";
  id: any | null;
  member_id: string | null;
  score: any | null;
  title: string | null;
  content: string | null;
  created_at: any | null;
  updated_at: any | null;
  /**
   * An array relationship
   */
  review_replies: GET_REVIEW_MEMBER_review_public_review_replies[];
}

export interface GET_REVIEW_MEMBER_review {
  __typename: "review";
  id: any;
  member_id: string;
  private_content: string | null;
}

export interface GET_REVIEW_MEMBER {
  /**
   * fetch aggregated fields from the table: "review_public"
   */
  review_public_aggregate: GET_REVIEW_MEMBER_review_public_aggregate;
  /**
   * fetch data from the table: "review_public"
   */
  review_public: GET_REVIEW_MEMBER_review_public[];
  /**
   * fetch data from the table: "review"
   */
  review: GET_REVIEW_MEMBER_review[];
}

export interface GET_REVIEW_MEMBERVariables {
  condition?: review_public_bool_exp | null;
  path: string;
  currentMemberId?: string | null;
  limit: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_REVIEW
// ====================================================

export interface INSERT_REVIEW_insert_review {
  __typename: "review_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_REVIEW {
  /**
   * insert data into the table: "review"
   */
  insert_review: INSERT_REVIEW_insert_review | null;
}

export interface INSERT_REVIEWVariables {
  path: string;
  memberId?: string | null;
  score?: any | null;
  title: string;
  content?: string | null;
  privateContent?: string | null;
  appId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_REVIEW
// ====================================================

export interface UPDATE_REVIEW_update_review {
  __typename: "review_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_REVIEW {
  /**
   * update data of the table: "review"
   */
  update_review: UPDATE_REVIEW_update_review | null;
}

export interface UPDATE_REVIEWVariables {
  reviewId: any;
  path: string;
  memberId?: string | null;
  score?: any | null;
  title: string;
  content?: string | null;
  privateContent?: string | null;
  appId: string;
  updateAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_REVIEW_PUBLIC
// ====================================================

export interface GET_REVIEW_PUBLIC_review_public_aggregate_aggregate {
  __typename: "review_public_aggregate_fields";
  count: number | null;
}

export interface GET_REVIEW_PUBLIC_review_public_aggregate {
  __typename: "review_public_aggregate";
  aggregate: GET_REVIEW_PUBLIC_review_public_aggregate_aggregate | null;
}

export interface GET_REVIEW_PUBLIC_review_public_review_replies_member {
  __typename: "member_public";
  id: string | null;
  role: string | null;
}

export interface GET_REVIEW_PUBLIC_review_public_review_replies {
  __typename: "review_reply";
  id: any;
  content: string | null;
  created_at: any;
  updated_at: any;
  /**
   * An object relationship
   */
  member: GET_REVIEW_PUBLIC_review_public_review_replies_member | null;
}

export interface GET_REVIEW_PUBLIC_review_public {
  __typename: "review_public";
  id: any | null;
  member_id: string | null;
  score: any | null;
  title: string | null;
  content: string | null;
  created_at: any | null;
  updated_at: any | null;
  /**
   * An array relationship
   */
  review_replies: GET_REVIEW_PUBLIC_review_public_review_replies[];
}

export interface GET_REVIEW_PUBLIC {
  /**
   * fetch aggregated fields from the table: "review_public"
   */
  review_public_aggregate: GET_REVIEW_PUBLIC_review_public_aggregate;
  /**
   * fetch data from the table: "review_public"
   */
  review_public: GET_REVIEW_PUBLIC_review_public[];
}

export interface GET_REVIEW_PUBLICVariables {
  condition?: review_public_bool_exp | null;
  limit: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_ROLE
// ====================================================

export interface GET_PROGRAM_ROLE_program_role {
  __typename: "program_role";
  id: any;
  /**
   * instructor / assistant 
   */
  name: string;
  member_id: string;
}

export interface GET_PROGRAM_ROLE {
  /**
   * fetch data from the table: "program_role"
   */
  program_role: GET_PROGRAM_ROLE_program_role[];
}

export interface GET_PROGRAM_ROLEVariables {
  targetId?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER_ORDERS
// ====================================================

export interface GET_MEMBER_ORDERS_order_log_order_products_product {
  __typename: "product";
  /**
   * {type}_{target}, ex: Program_123-456, ProgramPlan_123-456
   */
  id: string;
  /**
   * Program / ProgramPlan / ProgramContent / ProgramPackagePlan / ActivityTicket / Card / Merchandise / ProjectPlan / PodcastProgram / PodcastPlan / AppointmentServicePlan
   */
  type: string;
}

export interface GET_MEMBER_ORDERS_order_log_order_products {
  __typename: "order_product";
  id: any;
  name: string;
  price: any;
  started_at: any | null;
  ended_at: any | null;
  /**
   * An object relationship
   */
  product: GET_MEMBER_ORDERS_order_log_order_products_product;
  options: any | null;
  currency_id: string;
}

export interface GET_MEMBER_ORDERS_order_log_order_discounts {
  __typename: "order_discount";
  id: any;
  name: string;
  description: string | null;
  price: any;
  /**
   * Coupon / Voucher / Card / DownPrice
   */
  type: string;
  target: string;
  options: any | null;
}

export interface GET_MEMBER_ORDERS_order_log {
  __typename: "order_log";
  id: string;
  created_at: any;
  /**
   * SUCCESS, MATCHING, REFUND, PARTIAL_REFUND, PARTIAL_EXPIRED, PARTIAL_PAID, EXPIRED, UNPAID
   */
  status: string;
  shipping: any | null;
  /**
   * An array relationship
   */
  order_products: GET_MEMBER_ORDERS_order_log_order_products[];
  /**
   * An array relationship
   */
  order_discounts: GET_MEMBER_ORDERS_order_log_order_discounts[];
}

export interface GET_MEMBER_ORDERS {
  /**
   * fetch data from the table: "order_log"
   */
  order_log: GET_MEMBER_ORDERS_order_log[];
}

export interface GET_MEMBER_ORDERSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_APP
// ====================================================

export interface GET_APP_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
}

export interface GET_APP_app_by_pk_app_modules {
  __typename: "app_module";
  id: any;
  /**
   * activity | appointment | blog | invoice | learning_statistics | locale | member_card | merchandise | podcast | program_package | qrcode | social_connect | tempo_delivery | voucher | creator_display
   */
  module_id: string;
}

export interface GET_APP_app_by_pk_app_navs {
  __typename: "app_nav";
  block: string;
  position: number;
  label: string;
  icon: string | null;
  href: string;
  external: boolean;
  locale: string;
  tag: string | null;
}

export interface GET_APP_app_by_pk_app_settings {
  __typename: "app_setting";
  key: string;
  value: string;
}

export interface GET_APP_app_by_pk {
  __typename: "app";
  id: string;
  name: string | null;
  title: string | null;
  description: string | null;
  /**
   * An array relationship
   */
  app_modules: GET_APP_app_by_pk_app_modules[];
  /**
   * An array relationship
   */
  app_navs: GET_APP_app_by_pk_app_navs[];
  /**
   * An array relationship
   */
  app_settings: GET_APP_app_by_pk_app_settings[];
}

export interface GET_APP {
  /**
   * fetch data from the table: "currency"
   */
  currency: GET_APP_currency[];
  /**
   * fetch data from the table: "app" using primary key columns
   */
  app_by_pk: GET_APP_app_by_pk | null;
}

export interface GET_APPVariables {
  appId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION
// ====================================================

export interface GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION_podcast_program_podcast_program_roles_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION_podcast_program_podcast_program_roles {
  __typename: "podcast_program_role";
  /**
   * An object relationship
   */
  member: GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION_podcast_program_podcast_program_roles_member | null;
}

export interface GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION_podcast_program {
  __typename: "podcast_program";
  id: any;
  /**
   * An array relationship
   */
  podcast_program_roles: GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION_podcast_program_podcast_program_roles[];
}

export interface GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION {
  /**
   * fetch data from the table: "podcast_program"
   */
  podcast_program: GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION_podcast_program[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_OWNED_PROGRAMS
// ====================================================

export interface GET_OWNED_PROGRAMS_program_enrollment {
  __typename: "program_enrollment";
  program_id: any | null;
}

export interface GET_OWNED_PROGRAMS_program_plan_enrollment_program_plan {
  __typename: "program_plan";
  program_id: any;
}

export interface GET_OWNED_PROGRAMS_program_plan_enrollment {
  __typename: "program_plan_enrollment";
  /**
   * An object relationship
   */
  program_plan: GET_OWNED_PROGRAMS_program_plan_enrollment_program_plan | null;
}

export interface GET_OWNED_PROGRAMS {
  /**
   * fetch data from the table: "program_enrollment"
   */
  program_enrollment: GET_OWNED_PROGRAMS_program_enrollment[];
  /**
   * fetch data from the table: "program_plan_enrollment"
   */
  program_plan_enrollment: GET_OWNED_PROGRAMS_program_plan_enrollment[];
}

export interface GET_OWNED_PROGRAMSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROJECT_ENROLLMENT_COUNT
// ====================================================

export interface GET_PROJECT_ENROLLMENT_COUNT_project_plan_enrollment_aggregate_aggregate {
  __typename: "project_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PROJECT_ENROLLMENT_COUNT_project_plan_enrollment_aggregate {
  __typename: "project_plan_enrollment_aggregate";
  aggregate: GET_PROJECT_ENROLLMENT_COUNT_project_plan_enrollment_aggregate_aggregate | null;
}

export interface GET_PROJECT_ENROLLMENT_COUNT {
  /**
   * fetch aggregated fields from the table: "project_plan_enrollment"
   */
  project_plan_enrollment_aggregate: GET_PROJECT_ENROLLMENT_COUNT_project_plan_enrollment_aggregate;
}

export interface GET_PROJECT_ENROLLMENT_COUNTVariables {
  projectId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROJECT_PLANS
// ====================================================

export interface GET_ENROLLED_PROJECT_PLANS_project_plan_enrollment_project_plan_project {
  __typename: "project";
  id: any;
  title: string;
  expired_at: any | null;
}

export interface GET_ENROLLED_PROJECT_PLANS_project_plan_enrollment_project_plan {
  __typename: "project_plan";
  id: any;
  title: string;
  description: string | null;
  /**
   * An object relationship
   */
  project: GET_ENROLLED_PROJECT_PLANS_project_plan_enrollment_project_plan_project;
}

export interface GET_ENROLLED_PROJECT_PLANS_project_plan_enrollment {
  __typename: "project_plan_enrollment";
  /**
   * An object relationship
   */
  project_plan: GET_ENROLLED_PROJECT_PLANS_project_plan_enrollment_project_plan | null;
}

export interface GET_ENROLLED_PROJECT_PLANS {
  /**
   * fetch data from the table: "project_plan_enrollment"
   */
  project_plan_enrollment: GET_ENROLLED_PROJECT_PLANS_project_plan_enrollment[];
}

export interface GET_ENROLLED_PROJECT_PLANSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROJECT_PLAN_ENROLLMENT_COUNT
// ====================================================

export interface GET_PROJECT_PLAN_ENROLLMENT_COUNT_project_plan_enrollment_aggregate_aggregate {
  __typename: "project_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PROJECT_PLAN_ENROLLMENT_COUNT_project_plan_enrollment_aggregate {
  __typename: "project_plan_enrollment_aggregate";
  aggregate: GET_PROJECT_PLAN_ENROLLMENT_COUNT_project_plan_enrollment_aggregate_aggregate | null;
}

export interface GET_PROJECT_PLAN_ENROLLMENT_COUNT {
  /**
   * fetch aggregated fields from the table: "project_plan_enrollment"
   */
  project_plan_enrollment_aggregate: GET_PROJECT_PLAN_ENROLLMENT_COUNT_project_plan_enrollment_aggregate;
}

export interface GET_PROJECT_PLAN_ENROLLMENT_COUNTVariables {
  projectPlanId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_VOUCHER_COLLECTION
// ====================================================

export interface GET_VOUCHER_COLLECTION_voucher_status {
  __typename: "voucher_status";
  outdated: boolean | null;
  used: boolean | null;
}

export interface GET_VOUCHER_COLLECTION_voucher_voucher_code_voucher_plan_voucher_plan_products {
  __typename: "voucher_plan_product";
  id: any;
  product_id: string;
}

export interface GET_VOUCHER_COLLECTION_voucher_voucher_code_voucher_plan {
  __typename: "voucher_plan";
  id: any;
  title: string;
  description: string | null;
  started_at: any | null;
  ended_at: any | null;
  product_quantity_limit: number;
  /**
   * An array relationship
   */
  voucher_plan_products: GET_VOUCHER_COLLECTION_voucher_voucher_code_voucher_plan_voucher_plan_products[];
}

export interface GET_VOUCHER_COLLECTION_voucher_voucher_code {
  __typename: "voucher_code";
  id: any;
  code: string;
  /**
   * An object relationship
   */
  voucher_plan: GET_VOUCHER_COLLECTION_voucher_voucher_code_voucher_plan;
}

export interface GET_VOUCHER_COLLECTION_voucher {
  __typename: "voucher";
  id: any;
  /**
   * An object relationship
   */
  status: GET_VOUCHER_COLLECTION_voucher_status | null;
  /**
   * An object relationship
   */
  voucher_code: GET_VOUCHER_COLLECTION_voucher_voucher_code;
}

export interface GET_VOUCHER_COLLECTION {
  /**
   * fetch data from the table: "voucher"
   */
  voucher: GET_VOUCHER_COLLECTION_voucher[];
}

export interface GET_VOUCHER_COLLECTIONVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_CART_PRODUCT_COLLECTION
// ====================================================

export interface GET_CART_PRODUCT_COLLECTION_cart_product_product_product_owner {
  __typename: "product_owner";
  member_id: string | null;
}

export interface GET_CART_PRODUCT_COLLECTION_cart_product_product_product_enrollments {
  __typename: "product_enrollment";
  member_id: string | null;
  is_physical: boolean | null;
}

export interface GET_CART_PRODUCT_COLLECTION_cart_product_product {
  __typename: "product";
  /**
   * {type}_{target}, ex: Program_123-456, ProgramPlan_123-456
   */
  id: string;
  /**
   * Program / ProgramPlan / ProgramContent / ProgramPackagePlan / ActivityTicket / Card / Merchandise / ProjectPlan / PodcastProgram / PodcastPlan / AppointmentServicePlan
   */
  type: string;
  /**
   * An object relationship
   */
  product_owner: GET_CART_PRODUCT_COLLECTION_cart_product_product_product_owner | null;
  /**
   * An array relationship
   */
  product_enrollments: GET_CART_PRODUCT_COLLECTION_cart_product_product_product_enrollments[];
}

export interface GET_CART_PRODUCT_COLLECTION_cart_product {
  __typename: "cart_product";
  id: any;
  /**
   * An object relationship
   */
  product: GET_CART_PRODUCT_COLLECTION_cart_product_product;
}

export interface GET_CART_PRODUCT_COLLECTION_product_product_enrollments {
  __typename: "product_enrollment";
  member_id: string | null;
  is_physical: boolean | null;
}

export interface GET_CART_PRODUCT_COLLECTION_product {
  __typename: "product";
  /**
   * {type}_{target}, ex: Program_123-456, ProgramPlan_123-456
   */
  id: string;
  /**
   * Program / ProgramPlan / ProgramContent / ProgramPackagePlan / ActivityTicket / Card / Merchandise / ProjectPlan / PodcastProgram / PodcastPlan / AppointmentServicePlan
   */
  type: string;
  /**
   * An array relationship
   */
  product_enrollments: GET_CART_PRODUCT_COLLECTION_product_product_enrollments[];
}

export interface GET_CART_PRODUCT_COLLECTION_merchandise_spec_merchandise {
  __typename: "merchandise";
  id: any;
  member_shop_id: any | null;
}

export interface GET_CART_PRODUCT_COLLECTION_merchandise_spec {
  __typename: "merchandise_spec";
  id: any;
  /**
   * An object relationship
   */
  merchandise: GET_CART_PRODUCT_COLLECTION_merchandise_spec_merchandise;
}

export interface GET_CART_PRODUCT_COLLECTION {
  /**
   * fetch data from the table: "cart_product"
   */
  cart_product: GET_CART_PRODUCT_COLLECTION_cart_product[];
  /**
   * fetch data from the table: "product"
   */
  product: GET_CART_PRODUCT_COLLECTION_product[];
  /**
   * fetch data from the table: "merchandise_spec"
   */
  merchandise_spec: GET_CART_PRODUCT_COLLECTION_merchandise_spec[];
}

export interface GET_CART_PRODUCT_COLLECTIONVariables {
  appId: string;
  memberId: string;
  productIds?: string[] | null;
  localProductIds: string[];
  merchandiseSpecIds: any[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_CART_PRODUCTS
// ====================================================

export interface UPDATE_CART_PRODUCTS_delete_cart_product {
  __typename: "cart_product_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_CART_PRODUCTS_insert_cart_product {
  __typename: "cart_product_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_CART_PRODUCTS {
  /**
   * delete data from the table: "cart_product"
   */
  delete_cart_product: UPDATE_CART_PRODUCTS_delete_cart_product | null;
  /**
   * insert data into the table: "cart_product"
   */
  insert_cart_product: UPDATE_CART_PRODUCTS_insert_cart_product | null;
}

export interface UPDATE_CART_PRODUCTSVariables {
  memberId: string;
  cartProductObjects: cart_product_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_NOTIFICATIONS
// ====================================================

export interface GET_NOTIFICATIONS_notification {
  __typename: "notification";
  id: any;
  avatar: string | null;
  description: string;
  reference_url: string | null;
  extra: string | null;
  type: string | null;
  read_at: any | null;
  updated_at: any;
}

export interface GET_NOTIFICATIONS_notification_aggregate_aggregate {
  __typename: "notification_aggregate_fields";
  count: number | null;
}

export interface GET_NOTIFICATIONS_notification_aggregate {
  __typename: "notification_aggregate";
  aggregate: GET_NOTIFICATIONS_notification_aggregate_aggregate | null;
}

export interface GET_NOTIFICATIONS {
  /**
   * fetch data from the table: "notification"
   */
  notification: GET_NOTIFICATIONS_notification[];
  /**
   * fetch aggregated fields from the table: "notification"
   */
  notification_aggregate: GET_NOTIFICATIONS_notification_aggregate;
}

export interface GET_NOTIFICATIONSVariables {
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_PROGRAM_CONTENT_PROGRESS
// ====================================================

export interface INSERT_PROGRAM_CONTENT_PROGRESS_insert_program_content_progress {
  __typename: "program_content_progress_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_PROGRAM_CONTENT_PROGRESS {
  /**
   * insert data into the table: "program_content_progress"
   */
  insert_program_content_progress: INSERT_PROGRAM_CONTENT_PROGRESS_insert_program_content_progress | null;
}

export interface INSERT_PROGRAM_CONTENT_PROGRESSVariables {
  memberId: string;
  programContentId: any;
  progress: any;
  lastProgress: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_CONTENT_PROGRESS
// ====================================================

export interface GET_PROGRAM_CONTENT_PROGRESS_program_content_body_program_contents_program_content_progress {
  __typename: "program_content_progress";
  id: any;
  progress: any;
  last_progress: any;
}

export interface GET_PROGRAM_CONTENT_PROGRESS_program_content_body_program_contents {
  __typename: "program_content";
  id: any;
  content_section_id: any;
  /**
   * An array relationship
   */
  program_content_progress: GET_PROGRAM_CONTENT_PROGRESS_program_content_body_program_contents_program_content_progress[];
}

export interface GET_PROGRAM_CONTENT_PROGRESS_program_content_body {
  __typename: "program_content_body";
  /**
   * An array relationship
   */
  program_contents: GET_PROGRAM_CONTENT_PROGRESS_program_content_body_program_contents[];
}

export interface GET_PROGRAM_CONTENT_PROGRESS {
  /**
   * fetch data from the table: "program_content_body"
   */
  program_content_body: GET_PROGRAM_CONTENT_PROGRESS_program_content_body[];
}

export interface GET_PROGRAM_CONTENT_PROGRESSVariables {
  programId: any;
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_ACTIVITY_COLLECTION
// ====================================================

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories {
  __typename: "activity_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories_category;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate_aggregate {
  __typename: "activity_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate {
  __typename: "activity_enrollment_aggregate";
  aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate_aggregate | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_min {
  __typename: "activity_session_min_fields";
  started_at: any | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_max {
  __typename: "activity_session_max_fields";
  ended_at: any | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate {
  __typename: "activity_session_aggregate_fields";
  min: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_min | null;
  max: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate_max | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate {
  __typename: "activity_session_aggregate";
  aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate_aggregate | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate_sum {
  __typename: "activity_ticket_sum_fields";
  count: number | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate {
  __typename: "activity_ticket_aggregate_fields";
  sum: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate_sum | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate {
  __typename: "activity_ticket_aggregate";
  aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate_aggregate | null;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION_activity {
  __typename: "activity";
  id: any;
  cover_url: string | null;
  title: string;
  published_at: any | null;
  is_participants_visible: boolean;
  organizer_id: string;
  support_locales: any | null;
  /**
   * An array relationship
   */
  activity_categories: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_categories[];
  /**
   * An aggregated array relationship
   */
  activity_enrollments_aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_enrollments_aggregate;
  /**
   * An aggregated array relationship
   */
  activity_sessions_aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_sessions_aggregate;
  /**
   * An aggregated array relationship
   */
  activity_tickets_aggregate: GET_PUBLISHED_ACTIVITY_COLLECTION_activity_activity_tickets_aggregate;
}

export interface GET_PUBLISHED_ACTIVITY_COLLECTION {
  /**
   * fetch data from the table: "activity"
   */
  activity: GET_PUBLISHED_ACTIVITY_COLLECTION_activity[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_ACTIVITY_TICKETS
// ====================================================

export interface GET_ENROLLED_ACTIVITY_TICKETS_activity_ticket_enrollment {
  __typename: "activity_ticket_enrollment";
  order_log_id: string | null;
  order_product_id: any | null;
  activity_ticket_id: any | null;
}

export interface GET_ENROLLED_ACTIVITY_TICKETS {
  /**
   * fetch data from the table: "activity_ticket_enrollment"
   */
  activity_ticket_enrollment: GET_ENROLLED_ACTIVITY_TICKETS_activity_ticket_enrollment[];
}

export interface GET_ENROLLED_ACTIVITY_TICKETSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ACTIVITY_SESSION
// ====================================================

export interface GET_ACTIVITY_SESSION_activity_session_by_pk_activity {
  __typename: "activity";
  is_participants_visible: boolean;
}

export interface GET_ACTIVITY_SESSION_activity_session_by_pk_activity_session_tickets_activity_ticket {
  __typename: "activity_ticket";
  /**
   * unlimited as 99999999
   */
  count: number;
}

export interface GET_ACTIVITY_SESSION_activity_session_by_pk_activity_session_tickets {
  __typename: "activity_session_ticket";
  /**
   * An object relationship
   */
  activity_ticket: GET_ACTIVITY_SESSION_activity_session_by_pk_activity_session_tickets_activity_ticket;
}

export interface GET_ACTIVITY_SESSION_activity_session_by_pk_activity_enrollments_aggregate_aggregate {
  __typename: "activity_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_ACTIVITY_SESSION_activity_session_by_pk_activity_enrollments_aggregate {
  __typename: "activity_enrollment_aggregate";
  aggregate: GET_ACTIVITY_SESSION_activity_session_by_pk_activity_enrollments_aggregate_aggregate | null;
}

export interface GET_ACTIVITY_SESSION_activity_session_by_pk {
  __typename: "activity_session";
  id: any;
  title: string;
  started_at: any;
  ended_at: any;
  location: string | null;
  description: string | null;
  threshold: any | null;
  /**
   * An object relationship
   */
  activity: GET_ACTIVITY_SESSION_activity_session_by_pk_activity;
  /**
   * An array relationship
   */
  activity_session_tickets: GET_ACTIVITY_SESSION_activity_session_by_pk_activity_session_tickets[];
  /**
   * An aggregated array relationship
   */
  activity_enrollments_aggregate: GET_ACTIVITY_SESSION_activity_session_by_pk_activity_enrollments_aggregate;
}

export interface GET_ACTIVITY_SESSION {
  /**
   * fetch data from the table: "activity_session" using primary key columns
   */
  activity_session_by_pk: GET_ACTIVITY_SESSION_activity_session_by_pk | null;
}

export interface GET_ACTIVITY_SESSIONVariables {
  sessionId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_TICKET
// ====================================================

export interface GET_TICKET_activity_ticket_by_pk_activity_session_tickets_activity_session {
  __typename: "activity_session";
  id: any;
  title: string;
  description: string | null;
  location: string | null;
  started_at: any;
  ended_at: any;
  threshold: any | null;
}

export interface GET_TICKET_activity_ticket_by_pk_activity_session_tickets {
  __typename: "activity_session_ticket";
  id: any;
  /**
   * An object relationship
   */
  activity_session: GET_TICKET_activity_ticket_by_pk_activity_session_tickets_activity_session;
}

export interface GET_TICKET_activity_ticket_by_pk_activity_activity_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_TICKET_activity_ticket_by_pk_activity_activity_categories {
  __typename: "activity_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_TICKET_activity_ticket_by_pk_activity_activity_categories_category;
  position: number;
}

export interface GET_TICKET_activity_ticket_by_pk_activity {
  __typename: "activity";
  id: any;
  title: string;
  is_participants_visible: boolean;
  cover_url: string | null;
  published_at: any | null;
  /**
   * An array relationship
   */
  activity_categories: GET_TICKET_activity_ticket_by_pk_activity_activity_categories[];
}

export interface GET_TICKET_activity_ticket_by_pk {
  __typename: "activity_ticket";
  id: any;
  title: string;
  description: string | null;
  is_published: boolean;
  started_at: any;
  ended_at: any;
  /**
   * unlimited as 99999999
   */
  count: number;
  price: any;
  /**
   * An array relationship
   */
  activity_session_tickets: GET_TICKET_activity_ticket_by_pk_activity_session_tickets[];
  /**
   * An object relationship
   */
  activity: GET_TICKET_activity_ticket_by_pk_activity;
}

export interface GET_TICKET {
  /**
   * fetch data from the table: "activity_ticket" using primary key columns
   */
  activity_ticket_by_pk: GET_TICKET_activity_ticket_by_pk | null;
}

export interface GET_TICKETVariables {
  ticketId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ACTIVITY_ATTENDANCE
// ====================================================

export interface GET_ACTIVITY_ATTENDANCE_activity_enrollment {
  __typename: "activity_enrollment";
  activity_session_id: any | null;
  attended: boolean | null;
}

export interface GET_ACTIVITY_ATTENDANCE {
  /**
   * fetch data from the table: "activity_enrollment"
   */
  activity_enrollment: GET_ACTIVITY_ATTENDANCE_activity_enrollment[];
}

export interface GET_ACTIVITY_ATTENDANCEVariables {
  memberId: string;
  activityTicketId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ATTEND_ACTIVITY_SESSION
// ====================================================

export interface ATTEND_ACTIVITY_SESSION_insert_activity_attendance {
  __typename: "activity_attendance_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface ATTEND_ACTIVITY_SESSION {
  /**
   * insert data into the table: "activity_attendance"
   */
  insert_activity_attendance: ATTEND_ACTIVITY_SESSION_insert_activity_attendance | null;
}

export interface ATTEND_ACTIVITY_SESSIONVariables {
  orderProductId: any;
  activitySessionId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LEAVE_ACTIVITY_SESSION
// ====================================================

export interface LEAVE_ACTIVITY_SESSION_delete_activity_attendance {
  __typename: "activity_attendance_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface LEAVE_ACTIVITY_SESSION {
  /**
   * delete data from the table: "activity_attendance"
   */
  delete_activity_attendance: LEAVE_ACTIVITY_SESSION_delete_activity_attendance | null;
}

export interface LEAVE_ACTIVITY_SESSIONVariables {
  orderProductId: any;
  activitySessionId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_APPOINTMENT_PLAN_COLLECTION
// ====================================================

export interface GET_APPOINTMENT_PLAN_COLLECTION_appointment_plan_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
  name: string;
}

export interface GET_APPOINTMENT_PLAN_COLLECTION_appointment_plan_appointment_periods {
  __typename: "appointment_period";
  started_at: any | null;
  ended_at: any | null;
  booked: boolean | null;
  available: boolean | null;
}

export interface GET_APPOINTMENT_PLAN_COLLECTION_appointment_plan {
  __typename: "appointment_plan";
  id: any;
  title: string;
  description: string | null;
  /**
   * minutes
   */
  duration: any;
  price: any;
  support_locales: any | null;
  is_private: boolean;
  reservation_amount: any;
  /**
   * hour / day
   */
  reservation_type: string | null;
  /**
   * An object relationship
   */
  currency: GET_APPOINTMENT_PLAN_COLLECTION_appointment_plan_currency;
  /**
   * An array relationship
   */
  appointment_periods: GET_APPOINTMENT_PLAN_COLLECTION_appointment_plan_appointment_periods[];
}

export interface GET_APPOINTMENT_PLAN_COLLECTION {
  /**
   * fetch data from the table: "appointment_plan"
   */
  appointment_plan: GET_APPOINTMENT_PLAN_COLLECTION_appointment_plan[];
}

export interface GET_APPOINTMENT_PLAN_COLLECTIONVariables {
  memberId: string;
  startedAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_APPOINTMENT_PLAN
// ====================================================

export interface GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  picture_url: string | null;
}

export interface GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_appointment_plan_creator {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_appointment_plan {
  __typename: "appointment_plan";
  id: any;
  title: string;
  /**
   * An object relationship
   */
  creator: GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_appointment_plan_creator | null;
}

export interface GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_order_product {
  __typename: "order_product";
  id: any;
  deliverables: any | null;
  options: any | null;
}

export interface GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment {
  __typename: "appointment_enrollment";
  started_at: any | null;
  ended_at: any | null;
  canceled_at: string | null;
  order_product_id: any | null;
  issue: string | null;
  /**
   * An object relationship
   */
  member: GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_member | null;
  /**
   * An object relationship
   */
  appointment_plan: GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_appointment_plan | null;
  /**
   * An object relationship
   */
  order_product: GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment_order_product | null;
}

export interface GET_ENROLLED_APPOINTMENT_PLAN {
  /**
   * fetch data from the table: "appointment_enrollment"
   */
  appointment_enrollment: GET_ENROLLED_APPOINTMENT_PLAN_appointment_enrollment[];
}

export interface GET_ENROLLED_APPOINTMENT_PLANVariables {
  memberId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_APPOINTMENT_ISSUE
// ====================================================

export interface UPDATE_APPOINTMENT_ISSUE_update_order_product {
  __typename: "order_product_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_APPOINTMENT_ISSUE {
  /**
   * update data of the table: "order_product"
   */
  update_order_product: UPDATE_APPOINTMENT_ISSUE_update_order_product | null;
}

export interface UPDATE_APPOINTMENT_ISSUEVariables {
  orderProductId: any;
  data?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CANCEL_APPOINTMENT
// ====================================================

export interface CANCEL_APPOINTMENT_update_order_product {
  __typename: "order_product_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface CANCEL_APPOINTMENT {
  /**
   * update data of the table: "order_product"
   */
  update_order_product: CANCEL_APPOINTMENT_update_order_product | null;
}

export interface CANCEL_APPOINTMENTVariables {
  orderProductId: any;
  data?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_POST_PREVIEW_COLLECTION
// ====================================================

export interface GET_POST_PREVIEW_COLLECTION_post_post_roles_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_POST_PREVIEW_COLLECTION_post_post_roles {
  __typename: "post_role";
  id: any;
  /**
   * creator | author
   */
  name: string;
  /**
   * An object relationship
   */
  member: GET_POST_PREVIEW_COLLECTION_post_post_roles_member | null;
}

export interface GET_POST_PREVIEW_COLLECTION_post_post_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_POST_PREVIEW_COLLECTION_post_post_categories {
  __typename: "post_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_POST_PREVIEW_COLLECTION_post_post_categories_category;
}

export interface GET_POST_PREVIEW_COLLECTION_post_post_tags {
  __typename: "post_tag";
  id: any;
  tag_name: string;
}

export interface GET_POST_PREVIEW_COLLECTION_post {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
  cover_url: string | null;
  video_url: string | null;
  abstract: string | null;
  published_at: any | null;
  /**
   * An array relationship
   */
  post_roles: GET_POST_PREVIEW_COLLECTION_post_post_roles[];
  /**
   * An array relationship
   */
  post_categories: GET_POST_PREVIEW_COLLECTION_post_post_categories[];
  /**
   * An array relationship
   */
  post_tags: GET_POST_PREVIEW_COLLECTION_post_post_tags[];
}

export interface GET_POST_PREVIEW_COLLECTION {
  /**
   * fetch data from the table: "post"
   */
  post: GET_POST_PREVIEW_COLLECTION_post[];
}

export interface GET_POST_PREVIEW_COLLECTIONVariables {
  authorId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_POPULAR_POST_COLLECTION
// ====================================================

export interface GET_POPULAR_POST_COLLECTION_post_aggregate_aggregate {
  __typename: "post_aggregate_fields";
  count: number | null;
}

export interface GET_POPULAR_POST_COLLECTION_post_aggregate {
  __typename: "post_aggregate";
  aggregate: GET_POPULAR_POST_COLLECTION_post_aggregate_aggregate | null;
}

export interface GET_POPULAR_POST_COLLECTION_post {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
  cover_url: string | null;
  video_url: string | null;
}

export interface GET_POPULAR_POST_COLLECTION {
  /**
   * fetch aggregated fields from the table: "post"
   */
  post_aggregate: GET_POPULAR_POST_COLLECTION_post_aggregate;
  /**
   * fetch data from the table: "post"
   */
  post: GET_POPULAR_POST_COLLECTION_post[];
}

export interface GET_POPULAR_POST_COLLECTIONVariables {
  offset?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_RELATIVE_POST_COLLECTION
// ====================================================

export interface GET_RELATIVE_POST_COLLECTION_post_aggregate_aggregate {
  __typename: "post_aggregate_fields";
  count: number | null;
}

export interface GET_RELATIVE_POST_COLLECTION_post_aggregate {
  __typename: "post_aggregate";
  aggregate: GET_RELATIVE_POST_COLLECTION_post_aggregate_aggregate | null;
}

export interface GET_RELATIVE_POST_COLLECTION_post {
  __typename: "post";
  id: any;
  title: string;
  code_name: string | null;
  cover_url: string | null;
  video_url: string | null;
}

export interface GET_RELATIVE_POST_COLLECTION {
  /**
   * fetch aggregated fields from the table: "post"
   */
  post_aggregate: GET_RELATIVE_POST_COLLECTION_post_aggregate;
  /**
   * fetch data from the table: "post"
   */
  post: GET_RELATIVE_POST_COLLECTION_post[];
}

export interface GET_RELATIVE_POST_COLLECTIONVariables {
  tags?: string[] | null;
  offset?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_POST
// ====================================================

export interface GET_POST_post_post_roles_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  picture_url: string | null;
  abstract: string | null;
}

export interface GET_POST_post_post_roles {
  __typename: "post_role";
  id: any;
  /**
   * An object relationship
   */
  member: GET_POST_post_post_roles_member | null;
}

export interface GET_POST_post_post_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_POST_post_post_categories {
  __typename: "post_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_POST_post_post_categories_category;
}

export interface GET_POST_post_post_tags {
  __typename: "post_tag";
  id: any;
  tag_name: string;
}

export interface GET_POST_post_post_merchandises_merchandise_merchandise_tags {
  __typename: "merchandise_tag";
  tag_name: string;
}

export interface GET_POST_post_post_merchandises_merchandise_merchandise_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_POST_post_post_merchandises_merchandise_merchandise_categories {
  __typename: "merchandise_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_POST_post_post_merchandises_merchandise_merchandise_categories_category;
}

export interface GET_POST_post_post_merchandises_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
  /**
   * cover | common
   */
  type: string;
}

export interface GET_POST_post_post_merchandises_merchandise_member_shop {
  __typename: "member_shop";
  id: any;
  title: string;
  shipping_methods: any | null;
}

export interface GET_POST_post_post_merchandises_merchandise_merchandise_specs_merchandise_spec_inventory_status {
  __typename: "merchandise_spec_inventory_status";
  buyable_quantity: any | null;
}

export interface GET_POST_post_post_merchandises_merchandise_merchandise_specs {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  quota: number;
  /**
   * An object relationship
   */
  merchandise_spec_inventory_status: GET_POST_post_post_merchandises_merchandise_merchandise_specs_merchandise_spec_inventory_status | null;
}

export interface GET_POST_post_post_merchandises_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  abstract: string | null;
  description: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_limited: boolean;
  is_physical: boolean;
  is_customized: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An array relationship
   */
  merchandise_tags: GET_POST_post_post_merchandises_merchandise_merchandise_tags[];
  /**
   * An array relationship
   */
  merchandise_categories: GET_POST_post_post_merchandises_merchandise_merchandise_categories[];
  /**
   * An array relationship
   */
  merchandise_imgs: GET_POST_post_post_merchandises_merchandise_merchandise_imgs[];
  /**
   * An object relationship
   */
  member_shop: GET_POST_post_post_merchandises_merchandise_member_shop | null;
  /**
   * An array relationship
   */
  merchandise_specs: GET_POST_post_post_merchandises_merchandise_merchandise_specs[];
}

export interface GET_POST_post_post_merchandises {
  __typename: "post_merchandise";
  id: any;
  /**
   * An object relationship
   */
  merchandise: GET_POST_post_post_merchandises_merchandise;
}

export interface GET_POST_post {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
  description: string | null;
  cover_url: string | null;
  video_url: string | null;
  abstract: string | null;
  views: number;
  published_at: any | null;
  /**
   * An array relationship
   */
  post_roles: GET_POST_post_post_roles[];
  /**
   * An array relationship
   */
  post_categories: GET_POST_post_post_categories[];
  /**
   * An array relationship
   */
  post_tags: GET_POST_post_post_tags[];
  /**
   * An array relationship
   */
  post_merchandises: GET_POST_post_post_merchandises[];
}

export interface GET_POST_post_by_pk_post_roles_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  picture_url: string | null;
  abstract: string | null;
}

export interface GET_POST_post_by_pk_post_roles {
  __typename: "post_role";
  id: any;
  /**
   * An object relationship
   */
  member: GET_POST_post_by_pk_post_roles_member | null;
}

export interface GET_POST_post_by_pk_post_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_POST_post_by_pk_post_categories {
  __typename: "post_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_POST_post_by_pk_post_categories_category;
}

export interface GET_POST_post_by_pk_post_tags {
  __typename: "post_tag";
  id: any;
  tag_name: string;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_tags {
  __typename: "merchandise_tag";
  tag_name: string;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_categories {
  __typename: "merchandise_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_categories_category;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
  /**
   * cover | common
   */
  type: string;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_member_shop {
  __typename: "member_shop";
  id: any;
  title: string;
  shipping_methods: any | null;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_specs_merchandise_spec_inventory_status {
  __typename: "merchandise_spec_inventory_status";
  buyable_quantity: any | null;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_specs {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  quota: number;
  /**
   * An object relationship
   */
  merchandise_spec_inventory_status: GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_specs_merchandise_spec_inventory_status | null;
}

export interface GET_POST_post_by_pk_post_merchandises_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  abstract: string | null;
  description: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_limited: boolean;
  is_physical: boolean;
  is_customized: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An array relationship
   */
  merchandise_tags: GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_tags[];
  /**
   * An array relationship
   */
  merchandise_categories: GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_categories[];
  /**
   * An array relationship
   */
  merchandise_imgs: GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_imgs[];
  /**
   * An object relationship
   */
  member_shop: GET_POST_post_by_pk_post_merchandises_merchandise_member_shop | null;
  /**
   * An array relationship
   */
  merchandise_specs: GET_POST_post_by_pk_post_merchandises_merchandise_merchandise_specs[];
}

export interface GET_POST_post_by_pk_post_merchandises {
  __typename: "post_merchandise";
  id: any;
  /**
   * An object relationship
   */
  merchandise: GET_POST_post_by_pk_post_merchandises_merchandise;
}

export interface GET_POST_post_by_pk {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
  description: string | null;
  cover_url: string | null;
  video_url: string | null;
  abstract: string | null;
  views: number;
  published_at: any | null;
  /**
   * An array relationship
   */
  post_roles: GET_POST_post_by_pk_post_roles[];
  /**
   * An array relationship
   */
  post_categories: GET_POST_post_by_pk_post_categories[];
  /**
   * An array relationship
   */
  post_tags: GET_POST_post_by_pk_post_tags[];
  /**
   * An array relationship
   */
  post_merchandises: GET_POST_post_by_pk_post_merchandises[];
}

export interface GET_POST {
  /**
   * fetch data from the table: "post"
   */
  post: GET_POST_post[];
  /**
   * fetch data from the table: "post" using primary key columns
   */
  post_by_pk: GET_POST_post_by_pk | null;
}

export interface GET_POSTVariables {
  id: any;
  search: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PREV_POST
// ====================================================

export interface GET_PREV_POST_post {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
}

export interface GET_PREV_POST {
  /**
   * fetch data from the table: "post"
   */
  post: GET_PREV_POST_post[];
}

export interface GET_PREV_POSTVariables {
  publishedAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_NEXT_POST
// ====================================================

export interface GET_NEXT_POST_post {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
}

export interface GET_NEXT_POST {
  /**
   * fetch data from the table: "post"
   */
  post: GET_NEXT_POST_post[];
}

export interface GET_NEXT_POSTVariables {
  publishedAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ADD_POST_VIEWS
// ====================================================

export interface ADD_POST_VIEWS_update_post {
  __typename: "post_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface ADD_POST_VIEWS {
  /**
   * update data of the table: "post"
   */
  update_post: ADD_POST_VIEWS_update_post | null;
}

export interface ADD_POST_VIEWSVariables {
  id: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_LATEST_POST
// ====================================================

export interface GET_LATEST_POST_post {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
  cover_url: string | null;
  video_url: string | null;
  abstract: string | null;
  description: string | null;
  published_at: any | null;
}

export interface GET_LATEST_POST {
  /**
   * fetch data from the table: "post"
   */
  post: GET_LATEST_POST_post[];
}

export interface GET_LATEST_POSTVariables {
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_CARD_IDS
// ====================================================

export interface GET_ENROLLED_CARD_IDS_card_enrollment {
  __typename: "card_enrollment";
  card_id: any | null;
}

export interface GET_ENROLLED_CARD_IDS {
  /**
   * fetch data from the table: "card_enrollment"
   */
  card_enrollment: GET_ENROLLED_CARD_IDS_card_enrollment[];
}

export interface GET_ENROLLED_CARD_IDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_CARD
// ====================================================

export interface GET_ENROLLED_CARD_card_by_pk {
  __typename: "card";
  id: any;
  title: string;
  description: string;
  template: string;
  app_id: string;
}

export interface GET_ENROLLED_CARD {
  /**
   * fetch data from the table: "card" using primary key columns
   */
  card_by_pk: GET_ENROLLED_CARD_card_by_pk | null;
}

export interface GET_ENROLLED_CARDVariables {
  cardId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_CARDS
// ====================================================

export interface GET_ENROLLED_CARDS_card_enrollment_card {
  __typename: "card";
  id: any;
  title: string;
  description: string;
  template: string;
}

export interface GET_ENROLLED_CARDS_card_enrollment {
  __typename: "card_enrollment";
  /**
   * An object relationship
   */
  card: GET_ENROLLED_CARDS_card_enrollment_card | null;
  updated_at: any | null;
}

export interface GET_ENROLLED_CARDS {
  /**
   * fetch data from the table: "card_enrollment"
   */
  card_enrollment: GET_ENROLLED_CARDS_card_enrollment[];
}

export interface GET_ENROLLED_CARDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ORDER_PRODUCT
// ====================================================

export interface GET_ORDER_PRODUCT_order_product_by_pk_product {
  __typename: "product";
  /**
   * {type}_{target}, ex: Program_123-456, ProgramPlan_123-456
   */
  id: string;
  /**
   * Program / ProgramPlan / ProgramContent / ProgramPackagePlan / ActivityTicket / Card / Merchandise / ProjectPlan / PodcastProgram / PodcastPlan / AppointmentServicePlan
   */
  type: string;
  target: string;
}

export interface GET_ORDER_PRODUCT_order_product_by_pk_order_log {
  __typename: "order_log";
  id: string;
  member_id: string;
  /**
   * name | email | phone | address | postCode | buyerPhone | uniformTitle | uniformNumber
   */
  invoice: any;
}

export interface GET_ORDER_PRODUCT_order_product_by_pk {
  __typename: "order_product";
  id: any;
  name: string;
  description: string | null;
  created_at: any;
  /**
   * An object relationship
   */
  product: GET_ORDER_PRODUCT_order_product_by_pk_product;
  /**
   * An object relationship
   */
  order_log: GET_ORDER_PRODUCT_order_product_by_pk_order_log;
}

export interface GET_ORDER_PRODUCT {
  /**
   * fetch data from the table: "order_product" using primary key columns
   */
  order_product_by_pk: GET_ORDER_PRODUCT_order_product_by_pk | null;
}

export interface GET_ORDER_PRODUCTVariables {
  orderProductId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER_SHOP
// ====================================================

export interface GET_MEMBER_SHOP_member_shop_by_pk_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
}

export interface GET_MEMBER_SHOP_member_shop_by_pk {
  __typename: "member_shop";
  id: any;
  title: string;
  shipping_methods: any | null;
  /**
   * An object relationship
   */
  member: GET_MEMBER_SHOP_member_shop_by_pk_member | null;
}

export interface GET_MEMBER_SHOP {
  /**
   * fetch data from the table: "member_shop" using primary key columns
   */
  member_shop_by_pk: GET_MEMBER_SHOP_member_shop_by_pk | null;
}

export interface GET_MEMBER_SHOPVariables {
  shopId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_CART_PROJECT_PLAN_COLLECTION
// ====================================================

export interface GET_CART_PROJECT_PLAN_COLLECTION_project_plan {
  __typename: "project_plan";
  id: any;
  is_physical: boolean;
}

export interface GET_CART_PROJECT_PLAN_COLLECTION {
  /**
   * fetch data from the table: "project_plan"
   */
  project_plan: GET_CART_PROJECT_PLAN_COLLECTION_project_plan[];
}

export interface GET_CART_PROJECT_PLAN_COLLECTIONVariables {
  cartProjectPlanIds: any[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PHYSICAL_PRODUCTS
// ====================================================

export interface GET_PHYSICAL_PRODUCTS_project_plan_aggregate_aggregate {
  __typename: "project_plan_aggregate_fields";
  count: number | null;
}

export interface GET_PHYSICAL_PRODUCTS_project_plan_aggregate {
  __typename: "project_plan_aggregate";
  aggregate: GET_PHYSICAL_PRODUCTS_project_plan_aggregate_aggregate | null;
}

export interface GET_PHYSICAL_PRODUCTS_merchandise_spec_aggregate_aggregate {
  __typename: "merchandise_spec_aggregate_fields";
  count: number | null;
}

export interface GET_PHYSICAL_PRODUCTS_merchandise_spec_aggregate {
  __typename: "merchandise_spec_aggregate";
  aggregate: GET_PHYSICAL_PRODUCTS_merchandise_spec_aggregate_aggregate | null;
}

export interface GET_PHYSICAL_PRODUCTS {
  /**
   * fetch aggregated fields from the table: "project_plan"
   */
  project_plan_aggregate: GET_PHYSICAL_PRODUCTS_project_plan_aggregate;
  /**
   * fetch aggregated fields from the table: "merchandise_spec"
   */
  merchandise_spec_aggregate: GET_PHYSICAL_PRODUCTS_merchandise_spec_aggregate;
}

export interface GET_PHYSICAL_PRODUCTSVariables {
  productIds: any[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRODUCT_SIMPLE
// ====================================================

export interface GET_PRODUCT_SIMPLE_program_by_pk {
  __typename: "program";
  id: any;
  title: string;
  cover_url: string | null;
  is_subscription: boolean;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
}

export interface GET_PRODUCT_SIMPLE_program_plan_by_pk_program {
  __typename: "program";
  id: any;
  title: string;
  cover_url: string | null;
}

export interface GET_PRODUCT_SIMPLE_program_plan_by_pk {
  __typename: "program_plan";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  period_amount: any | null;
  period_type: string | null;
  group_buying_people: any | null;
  /**
   * An object relationship
   */
  program: GET_PRODUCT_SIMPLE_program_plan_by_pk_program;
}

export interface GET_PRODUCT_SIMPLE_program_package_plan_by_pk_program_package {
  __typename: "program_package";
  id: any;
  title: string;
  cover_url: string | null;
}

export interface GET_PRODUCT_SIMPLE_program_package_plan_by_pk {
  __typename: "program_package_plan";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any | null;
  period_amount: any;
  period_type: string;
  is_subscription: boolean;
  /**
   * An object relationship
   */
  program_package: GET_PRODUCT_SIMPLE_program_package_plan_by_pk_program_package;
}

export interface GET_PRODUCT_SIMPLE_card_by_pk {
  __typename: "card";
  id: any;
  title: string;
}

export interface GET_PRODUCT_SIMPLE_activity_ticket_by_pk_activity {
  __typename: "activity";
  id: any;
  title: string;
  cover_url: string | null;
}

export interface GET_PRODUCT_SIMPLE_activity_ticket_by_pk {
  __typename: "activity_ticket";
  id: any;
  title: string;
  price: any;
  /**
   * An object relationship
   */
  activity: GET_PRODUCT_SIMPLE_activity_ticket_by_pk_activity;
}

export interface GET_PRODUCT_SIMPLE_project_plan_by_pk_project {
  __typename: "project";
  id: any;
  title: string;
}

export interface GET_PRODUCT_SIMPLE_project_plan_by_pk {
  __typename: "project_plan";
  id: any;
  title: string;
  cover_url: string | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  period_amount: any | null;
  /**
   * Y / M / W / D
   */
  period_type: string | null;
  /**
   * An object relationship
   */
  project: GET_PRODUCT_SIMPLE_project_plan_by_pk_project;
  is_limited: boolean;
  is_physical: boolean;
}

export interface GET_PRODUCT_SIMPLE_podcast_program_by_pk {
  __typename: "podcast_program";
  id: any;
  title: string;
  cover_url: string | null;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
}

export interface GET_PRODUCT_SIMPLE_podcast_plan_by_pk_creator {
  __typename: "member_public";
  name: string | null;
  username: string | null;
}

export interface GET_PRODUCT_SIMPLE_podcast_plan_by_pk {
  __typename: "podcast_plan";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  /**
   * An object relationship
   */
  creator: GET_PRODUCT_SIMPLE_podcast_plan_by_pk_creator | null;
}

export interface GET_PRODUCT_SIMPLE_appointment_plan_by_pk_creator {
  __typename: "member_public";
  name: string | null;
  username: string | null;
  picture_url: string | null;
}

export interface GET_PRODUCT_SIMPLE_appointment_plan_by_pk_appointment_periods {
  __typename: "appointment_period";
  started_at: any | null;
  ended_at: any | null;
  booked: boolean | null;
}

export interface GET_PRODUCT_SIMPLE_appointment_plan_by_pk {
  __typename: "appointment_plan";
  id: any;
  title: string;
  price: any;
  /**
   * An object relationship
   */
  creator: GET_PRODUCT_SIMPLE_appointment_plan_by_pk_creator | null;
  /**
   * An array relationship
   */
  appointment_periods: GET_PRODUCT_SIMPLE_appointment_plan_by_pk_appointment_periods[];
}

export interface GET_PRODUCT_SIMPLE_merchandise_by_pk_merchandise_imgs {
  __typename: "merchandise_img";
  url: string;
}

export interface GET_PRODUCT_SIMPLE_merchandise_by_pk {
  __typename: "merchandise";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  is_physical: boolean;
  /**
   * An array relationship
   */
  merchandise_imgs: GET_PRODUCT_SIMPLE_merchandise_by_pk_merchandise_imgs[];
}

export interface GET_PRODUCT_SIMPLE_merchandise_spec_by_pk_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
}

export interface GET_PRODUCT_SIMPLE_merchandise_spec_by_pk_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  is_physical: boolean;
  is_customized: boolean;
  /**
   * An array relationship
   */
  merchandise_imgs: GET_PRODUCT_SIMPLE_merchandise_spec_by_pk_merchandise_merchandise_imgs[];
}

export interface GET_PRODUCT_SIMPLE_merchandise_spec_by_pk {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  /**
   * An object relationship
   */
  merchandise: GET_PRODUCT_SIMPLE_merchandise_spec_by_pk_merchandise;
}

export interface GET_PRODUCT_SIMPLE {
  /**
   * fetch data from the table: "program" using primary key columns
   */
  program_by_pk: GET_PRODUCT_SIMPLE_program_by_pk | null;
  /**
   * fetch data from the table: "program_plan" using primary key columns
   */
  program_plan_by_pk: GET_PRODUCT_SIMPLE_program_plan_by_pk | null;
  /**
   * fetch data from the table: "program_package_plan" using primary key columns
   */
  program_package_plan_by_pk: GET_PRODUCT_SIMPLE_program_package_plan_by_pk | null;
  /**
   * fetch data from the table: "card" using primary key columns
   */
  card_by_pk: GET_PRODUCT_SIMPLE_card_by_pk | null;
  /**
   * fetch data from the table: "activity_ticket" using primary key columns
   */
  activity_ticket_by_pk: GET_PRODUCT_SIMPLE_activity_ticket_by_pk | null;
  /**
   * fetch data from the table: "project_plan" using primary key columns
   */
  project_plan_by_pk: GET_PRODUCT_SIMPLE_project_plan_by_pk | null;
  /**
   * fetch data from the table: "podcast_program" using primary key columns
   */
  podcast_program_by_pk: GET_PRODUCT_SIMPLE_podcast_program_by_pk | null;
  /**
   * fetch data from the table: "podcast_plan" using primary key columns
   */
  podcast_plan_by_pk: GET_PRODUCT_SIMPLE_podcast_plan_by_pk | null;
  /**
   * fetch data from the table: "appointment_plan" using primary key columns
   */
  appointment_plan_by_pk: GET_PRODUCT_SIMPLE_appointment_plan_by_pk | null;
  /**
   * fetch data from the table: "merchandise" using primary key columns
   */
  merchandise_by_pk: GET_PRODUCT_SIMPLE_merchandise_by_pk | null;
  /**
   * fetch data from the table: "merchandise_spec" using primary key columns
   */
  merchandise_spec_by_pk: GET_PRODUCT_SIMPLE_merchandise_spec_by_pk | null;
}

export interface GET_PRODUCT_SIMPLEVariables {
  targetId: any;
  startedAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SEARCH_MEMBER
// ====================================================

export interface SEARCH_MEMBER_member_public {
  __typename: "member_public";
  id: string | null;
}

export interface SEARCH_MEMBER {
  /**
   * fetch data from the table: "member_public"
   */
  member_public: SEARCH_MEMBER_member_public[];
}

export interface SEARCH_MEMBERVariables {
  email: string;
  appId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SEARCH_MEMBERS
// ====================================================

export interface SEARCH_MEMBERS_member_public {
  __typename: "member_public";
  id: string | null;
  email: string | null;
}

export interface SEARCH_MEMBERS {
  /**
   * fetch data from the table: "member_public"
   */
  member_public: SEARCH_MEMBERS_member_public[];
}

export interface SEARCH_MEMBERSVariables {
  emails: string[];
  appId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_COUPON_COLLECTION
// ====================================================

export interface GET_COUPON_COLLECTION_coupon_status {
  __typename: "coupon_status";
  outdated: boolean | null;
  used: boolean | null;
}

export interface GET_COUPON_COLLECTION_coupon_coupon_code_coupon_plan_coupon_plan_products {
  __typename: "coupon_plan_product";
  id: any;
  product_id: string;
}

export interface GET_COUPON_COLLECTION_coupon_coupon_code_coupon_plan {
  __typename: "coupon_plan";
  id: any;
  title: string;
  amount: any;
  /**
   * 1 - cash / 2 - percent
   */
  type: number;
  constraint: any | null;
  started_at: any | null;
  ended_at: any | null;
  description: string | null;
  scope: any | null;
  /**
   * An array relationship
   */
  coupon_plan_products: GET_COUPON_COLLECTION_coupon_coupon_code_coupon_plan_coupon_plan_products[];
}

export interface GET_COUPON_COLLECTION_coupon_coupon_code {
  __typename: "coupon_code";
  code: string;
  /**
   * An object relationship
   */
  coupon_plan: GET_COUPON_COLLECTION_coupon_coupon_code_coupon_plan;
}

export interface GET_COUPON_COLLECTION_coupon {
  __typename: "coupon";
  id: any;
  /**
   * An object relationship
   */
  status: GET_COUPON_COLLECTION_coupon_status | null;
  /**
   * An object relationship
   */
  coupon_code: GET_COUPON_COLLECTION_coupon_coupon_code;
}

export interface GET_COUPON_COLLECTION {
  /**
   * fetch data from the table: "coupon"
   */
  coupon: GET_COUPON_COLLECTION_coupon[];
}

export interface GET_COUPON_COLLECTIONVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PRODUCTS
// ====================================================

export interface GET_ENROLLED_PRODUCTS_product_enrollment {
  __typename: "product_enrollment";
  product_id: string | null;
}

export interface GET_ENROLLED_PRODUCTS {
  /**
   * fetch data from the table: "product_enrollment"
   */
  product_enrollment: GET_ENROLLED_PRODUCTS_product_enrollment[];
}

export interface GET_ENROLLED_PRODUCTSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER_CONTRACT
// ====================================================

export interface GET_MEMBER_CONTRACT_member_contract_by_pk_contract {
  __typename: "contract";
  name: string;
  description: string;
  template: string;
}

export interface GET_MEMBER_CONTRACT_member_contract_by_pk {
  __typename: "member_contract";
  started_at: any | null;
  ended_at: any | null;
  values: any | null;
  agreed_at: any | null;
  agreed_ip: string | null;
  revoked_at: any | null;
  agreed_options: any | null;
  /**
   * An object relationship
   */
  contract: GET_MEMBER_CONTRACT_member_contract_by_pk_contract;
}

export interface GET_MEMBER_CONTRACT {
  /**
   * fetch data from the table: "member_contract" using primary key columns
   */
  member_contract_by_pk: GET_MEMBER_CONTRACT_member_contract_by_pk | null;
}

export interface GET_MEMBER_CONTRACTVariables {
  memberContractId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_ATTACHMENT
// ====================================================

export interface INSERT_ATTACHMENT_insert_attachment_returning {
  __typename: "attachment";
  id: any;
}

export interface INSERT_ATTACHMENT_insert_attachment {
  __typename: "attachment_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: INSERT_ATTACHMENT_insert_attachment_returning[];
}

export interface INSERT_ATTACHMENT {
  /**
   * insert data into the table: "attachment"
   */
  insert_attachment: INSERT_ATTACHMENT_insert_attachment | null;
}

export interface INSERT_ATTACHMENTVariables {
  attachments: attachment_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ISSUE_THREAD
// ====================================================

export interface GET_ISSUE_THREAD_issue_issue_reactions {
  __typename: "issue_reaction";
  member_id: string;
}

export interface GET_ISSUE_THREAD_issue_issue_replies_aggregate_aggregate {
  __typename: "issue_reply_aggregate_fields";
  count: number | null;
}

export interface GET_ISSUE_THREAD_issue_issue_replies_aggregate {
  __typename: "issue_reply_aggregate";
  aggregate: GET_ISSUE_THREAD_issue_issue_replies_aggregate_aggregate | null;
}

export interface GET_ISSUE_THREAD_issue {
  __typename: "issue";
  id: any;
  title: string;
  description: string;
  solved_at: any | null;
  created_at: any;
  member_id: string;
  /**
   * An array relationship
   */
  issue_reactions: GET_ISSUE_THREAD_issue_issue_reactions[];
  /**
   * An aggregated array relationship
   */
  issue_replies_aggregate: GET_ISSUE_THREAD_issue_issue_replies_aggregate;
}

export interface GET_ISSUE_THREAD {
  /**
   * fetch data from the table: "issue"
   */
  issue: GET_ISSUE_THREAD_issue[];
}

export interface GET_ISSUE_THREADVariables {
  appId: string;
  threadId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_ISSUE
// ====================================================

export interface UPDATE_ISSUE_update_issue {
  __typename: "issue_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_ISSUE {
  /**
   * update data of the table: "issue"
   */
  update_issue: UPDATE_ISSUE_update_issue | null;
}

export interface UPDATE_ISSUEVariables {
  issueId: any;
  title?: string | null;
  description?: string | null;
  solvedAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_ISSUE
// ====================================================

export interface DELETE_ISSUE_delete_issue_reply_reaction {
  __typename: "issue_reply_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_delete_issue_reply {
  __typename: "issue_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_delete_issue_reaction {
  __typename: "issue_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_delete_issue {
  __typename: "issue_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE {
  /**
   * delete data from the table: "issue_reply_reaction"
   */
  delete_issue_reply_reaction: DELETE_ISSUE_delete_issue_reply_reaction | null;
  /**
   * delete data from the table: "issue_reply"
   */
  delete_issue_reply: DELETE_ISSUE_delete_issue_reply | null;
  /**
   * delete data from the table: "issue_reaction"
   */
  delete_issue_reaction: DELETE_ISSUE_delete_issue_reaction | null;
  /**
   * delete data from the table: "issue"
   */
  delete_issue: DELETE_ISSUE_delete_issue | null;
}

export interface DELETE_ISSUEVariables {
  issueId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_ISSUE_REACTION
// ====================================================

export interface INSERT_ISSUE_REACTION_insert_issue_reaction {
  __typename: "issue_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_ISSUE_REACTION {
  /**
   * insert data into the table: "issue_reaction"
   */
  insert_issue_reaction: INSERT_ISSUE_REACTION_insert_issue_reaction | null;
}

export interface INSERT_ISSUE_REACTIONVariables {
  memberId: string;
  issueId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_ISSUE_REACTION
// ====================================================

export interface DELETE_ISSUE_REACTION_delete_issue_reaction {
  __typename: "issue_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_REACTION {
  /**
   * delete data from the table: "issue_reaction"
   */
  delete_issue_reaction: DELETE_ISSUE_REACTION_delete_issue_reaction | null;
}

export interface DELETE_ISSUE_REACTIONVariables {
  memberId: string;
  issueId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ISSUE_REPLIES
// ====================================================

export interface GET_ISSUE_REPLIES_issue_reply_issue_reply_reactions_public_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
}

export interface GET_ISSUE_REPLIES_issue_reply_issue_reply_reactions {
  __typename: "issue_reply_reaction";
  /**
   * An object relationship
   */
  public_member: GET_ISSUE_REPLIES_issue_reply_issue_reply_reactions_public_member | null;
}

export interface GET_ISSUE_REPLIES_issue_reply {
  __typename: "issue_reply";
  id: any;
  content: string;
  created_at: any;
  member_id: string;
  /**
   * An array relationship
   */
  issue_reply_reactions: GET_ISSUE_REPLIES_issue_reply_issue_reply_reactions[];
}

export interface GET_ISSUE_REPLIES {
  /**
   * fetch data from the table: "issue_reply"
   */
  issue_reply: GET_ISSUE_REPLIES_issue_reply[];
}

export interface GET_ISSUE_REPLIESVariables {
  issueId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_ISSUE_REPLY_REACTION
// ====================================================

export interface INSERT_ISSUE_REPLY_REACTION_insert_issue_reply_reaction {
  __typename: "issue_reply_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_ISSUE_REPLY_REACTION {
  /**
   * insert data into the table: "issue_reply_reaction"
   */
  insert_issue_reply_reaction: INSERT_ISSUE_REPLY_REACTION_insert_issue_reply_reaction | null;
}

export interface INSERT_ISSUE_REPLY_REACTIONVariables {
  memberId: string;
  issueReplyId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_ISSUE_REPLY_REACTION
// ====================================================

export interface DELETE_ISSUE_REPLY_REACTION_delete_issue_reply_reaction {
  __typename: "issue_reply_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_REPLY_REACTION {
  /**
   * delete data from the table: "issue_reply_reaction"
   */
  delete_issue_reply_reaction: DELETE_ISSUE_REPLY_REACTION_delete_issue_reply_reaction | null;
}

export interface DELETE_ISSUE_REPLY_REACTIONVariables {
  memberId: string;
  issueReplyId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_ISSUE_REPLY
// ====================================================

export interface INSERT_ISSUE_REPLY_insert_issue_reply {
  __typename: "issue_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_ISSUE_REPLY {
  /**
   * insert data into the table: "issue_reply"
   */
  insert_issue_reply: INSERT_ISSUE_REPLY_insert_issue_reply | null;
}

export interface INSERT_ISSUE_REPLYVariables {
  memberId: string;
  issueId: any;
  content?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_ISSUE_REPLY
// ====================================================

export interface UPDATE_ISSUE_REPLY_update_issue_reply {
  __typename: "issue_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_ISSUE_REPLY {
  /**
   * update data of the table: "issue_reply"
   */
  update_issue_reply: UPDATE_ISSUE_REPLY_update_issue_reply | null;
}

export interface UPDATE_ISSUE_REPLYVariables {
  issueReplyId: any;
  content?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_ISSUE_REPLY
// ====================================================

export interface DELETE_ISSUE_REPLY_delete_issue_reply_reaction {
  __typename: "issue_reply_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_REPLY_delete_issue_reply {
  __typename: "issue_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_ISSUE_REPLY {
  /**
   * delete data from the table: "issue_reply_reaction"
   */
  delete_issue_reply_reaction: DELETE_ISSUE_REPLY_delete_issue_reply_reaction | null;
  /**
   * delete data from the table: "issue_reply"
   */
  delete_issue_reply: DELETE_ISSUE_REPLY_delete_issue_reply | null;
}

export interface DELETE_ISSUE_REPLYVariables {
  issueReplyId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER
// ====================================================

export interface GET_MEMBER_member_by_pk_member_phones {
  __typename: "member_phone";
  id: any;
  phone: string;
}

export interface GET_MEMBER_member_by_pk {
  __typename: "member";
  id: string;
  /**
   * app-owner / content-creator
   */
  role: string;
  username: string;
  name: string;
  email: string;
  picture_url: string | null;
  metadata: any;
  description: string | null;
  created_at: any | null;
  logined_at: any | null;
  facebook_user_id: string | null;
  google_user_id: string | null;
  /**
   * array of youtube channel ids
   */
  youtube_channel_ids: any | null;
  /**
   * An array relationship
   */
  member_phones: GET_MEMBER_member_by_pk_member_phones[];
}

export interface GET_MEMBER {
  /**
   * fetch data from the table: "member" using primary key columns
   */
  member_by_pk: GET_MEMBER_member_by_pk | null;
}

export interface GET_MEMBERVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLIC_MEMBER
// ====================================================

export interface GET_PUBLIC_MEMBER_member_public_member_specialities {
  __typename: "member_speciality";
  id: any;
  tag_name: string;
}

export interface GET_PUBLIC_MEMBER_member_public {
  __typename: "member_public";
  id: string | null;
  app_id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
  tag_names: any | null;
  abstract: string | null;
  description: string | null;
  role: string | null;
  title: string | null;
  /**
   * An array relationship
   */
  member_specialities: GET_PUBLIC_MEMBER_member_public_member_specialities[];
}

export interface GET_PUBLIC_MEMBER {
  /**
   * fetch data from the table: "member_public"
   */
  member_public: GET_PUBLIC_MEMBER_member_public[];
}

export interface GET_PUBLIC_MEMBERVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_MEMBER
// ====================================================

export interface UPDATE_MEMBER_update_member {
  __typename: "member_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_MEMBER {
  /**
   * update data of the table: "member"
   */
  update_member: UPDATE_MEMBER_update_member | null;
}

export interface UPDATE_MEMBERVariables {
  memberId: string;
  name?: string | null;
  description?: string | null;
  username?: string | null;
  email?: string | null;
  pictureUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_MEMBER_METADATA
// ====================================================

export interface UPDATE_MEMBER_METADATA_update_member {
  __typename: "member_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_MEMBER_METADATA_insert_member_phone {
  __typename: "member_phone_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_MEMBER_METADATA {
  /**
   * update data of the table: "member"
   */
  update_member: UPDATE_MEMBER_METADATA_update_member | null;
  /**
   * insert data into the table: "member_phone"
   */
  insert_member_phone: UPDATE_MEMBER_METADATA_insert_member_phone | null;
}

export interface UPDATE_MEMBER_METADATAVariables {
  memberId: string;
  metadata?: any | null;
  memberPhones: member_phone_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_CREATOR_COLLECTION
// ====================================================

export interface GET_CREATOR_COLLECTION_member_public {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
  abstract: string | null;
  description: string | null;
  role: string | null;
  title: string | null;
}

export interface GET_CREATOR_COLLECTION {
  /**
   * fetch data from the table: "member_public"
   */
  member_public: GET_CREATOR_COLLECTION_member_public[];
}

export interface GET_CREATOR_COLLECTIONVariables {
  appId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION
// ====================================================

export interface UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION_update_member {
  __typename: "member_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION {
  /**
   * update data of the table: "member"
   */
  update_member: UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION_update_member | null;
}

export interface UPDATE_YOUTUBE_CHANNEL_ID_COLLECTIONVariables {
  memberId: string;
  data?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_SOCIAL_CARD_COLLECTION
// ====================================================

export interface GET_SOCIAL_CARD_COLLECTION_social_card_enrollment_social_card_member_social {
  __typename: "member_social";
  id: any;
  name: string;
  profile_url: string | null;
  channel_url: string | null;
  /**
   * youtube
   */
  type: string;
}

export interface GET_SOCIAL_CARD_COLLECTION_social_card_enrollment_social_card {
  __typename: "social_card";
  id: any;
  name: string;
  badge_url: string | null;
  description: string | null;
  /**
   * An object relationship
   */
  member_social: GET_SOCIAL_CARD_COLLECTION_social_card_enrollment_social_card_member_social;
}

export interface GET_SOCIAL_CARD_COLLECTION_social_card_enrollment {
  __typename: "social_card_enrollment";
  /**
   * An object relationship
   */
  social_card: GET_SOCIAL_CARD_COLLECTION_social_card_enrollment_social_card | null;
}

export interface GET_SOCIAL_CARD_COLLECTION {
  /**
   * fetch data from the table: "social_card_enrollment"
   */
  social_card_enrollment: GET_SOCIAL_CARD_COLLECTION_social_card_enrollment[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_LATEST_CREATOR
// ====================================================

export interface GET_LATEST_CREATOR_topInstructor {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  abstract: string | null;
  picture_url: string | null;
}

export interface GET_LATEST_CREATOR_otherInstructor {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  abstract: string | null;
  picture_url: string | null;
}

export interface GET_LATEST_CREATOR {
  /**
   * fetch data from the table: "member_public"
   */
  topInstructor: GET_LATEST_CREATOR_topInstructor[];
  /**
   * fetch data from the table: "member_public"
   */
  otherInstructor: GET_LATEST_CREATOR_otherInstructor[];
}

export interface GET_LATEST_CREATORVariables {
  topInstructorIds: string[];
  appId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MERCHANDISE_COLLECTION
// ====================================================

export interface GET_MERCHANDISE_COLLECTION_merchandise_merchandise_tags {
  __typename: "merchandise_tag";
  tag_name: string;
}

export interface GET_MERCHANDISE_COLLECTION_merchandise_merchandise_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_MERCHANDISE_COLLECTION_merchandise_merchandise_categories {
  __typename: "merchandise_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_MERCHANDISE_COLLECTION_merchandise_merchandise_categories_category;
}

export interface GET_MERCHANDISE_COLLECTION_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
}

export interface GET_MERCHANDISE_COLLECTION_merchandise_merchandise_specs {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
}

export interface GET_MERCHANDISE_COLLECTION_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  /**
   * An array relationship
   */
  merchandise_tags: GET_MERCHANDISE_COLLECTION_merchandise_merchandise_tags[];
  /**
   * An array relationship
   */
  merchandise_categories: GET_MERCHANDISE_COLLECTION_merchandise_merchandise_categories[];
  /**
   * An array relationship
   */
  merchandise_imgs: GET_MERCHANDISE_COLLECTION_merchandise_merchandise_imgs[];
  /**
   * An array relationship
   */
  merchandise_specs: GET_MERCHANDISE_COLLECTION_merchandise_merchandise_specs[];
}

export interface GET_MERCHANDISE_COLLECTION {
  /**
   * fetch data from the table: "merchandise"
   */
  merchandise: GET_MERCHANDISE_COLLECTION_merchandise[];
}

export interface GET_MERCHANDISE_COLLECTIONVariables {
  search?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MERCHANDISE
// ====================================================

export interface GET_MERCHANDISE_merchandise_by_pk_merchandise_tags {
  __typename: "merchandise_tag";
  tag_name: string;
}

export interface GET_MERCHANDISE_merchandise_by_pk_merchandise_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_MERCHANDISE_merchandise_by_pk_merchandise_categories {
  __typename: "merchandise_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_MERCHANDISE_merchandise_by_pk_merchandise_categories_category;
}

export interface GET_MERCHANDISE_merchandise_by_pk_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  /**
   * cover | common
   */
  type: string;
  url: string;
}

export interface GET_MERCHANDISE_merchandise_by_pk_member_shop {
  __typename: "member_shop";
  id: any;
  title: string;
  shipping_methods: any | null;
}

export interface GET_MERCHANDISE_merchandise_by_pk_merchandise_specs_merchandise_spec_inventory_status {
  __typename: "merchandise_spec_inventory_status";
  buyable_quantity: any | null;
}

export interface GET_MERCHANDISE_merchandise_by_pk_merchandise_specs {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  quota: number;
  /**
   * An object relationship
   */
  merchandise_spec_inventory_status: GET_MERCHANDISE_merchandise_by_pk_merchandise_specs_merchandise_spec_inventory_status | null;
}

export interface GET_MERCHANDISE_merchandise_by_pk {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  abstract: string | null;
  description: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_limited: boolean;
  is_physical: boolean;
  is_customized: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An array relationship
   */
  merchandise_tags: GET_MERCHANDISE_merchandise_by_pk_merchandise_tags[];
  /**
   * An array relationship
   */
  merchandise_categories: GET_MERCHANDISE_merchandise_by_pk_merchandise_categories[];
  /**
   * An array relationship
   */
  merchandise_imgs: GET_MERCHANDISE_merchandise_by_pk_merchandise_imgs[];
  /**
   * An object relationship
   */
  member_shop: GET_MERCHANDISE_merchandise_by_pk_member_shop | null;
  /**
   * An array relationship
   */
  merchandise_specs: GET_MERCHANDISE_merchandise_by_pk_merchandise_specs[];
}

export interface GET_MERCHANDISE {
  /**
   * fetch data from the table: "merchandise" using primary key columns
   */
  merchandise_by_pk: GET_MERCHANDISE_merchandise_by_pk | null;
}

export interface GET_MERCHANDISEVariables {
  merchandiseId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC
// ====================================================

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_products_order_product_files {
  __typename: "order_product_file";
  id: any;
  data: any | null;
}

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_products {
  __typename: "order_product";
  id: any;
  product_id: string;
  options: any | null;
  /**
   * An array relationship
   */
  order_product_files: GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_products_order_product_files[];
}

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_contacts_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  picture_url: string | null;
}

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_contacts {
  __typename: "order_contact";
  id: any;
  order_id: string;
  message: string;
  created_at: any;
  updated_at: any;
  /**
   * An object relationship
   */
  member: GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_contacts_member | null;
}

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log {
  __typename: "order_log";
  id: string;
  created_at: any;
  updated_at: any | null;
  delivered_at: any | null;
  deliver_message: string | null;
  shipping: any | null;
  /**
   * name | email | phone | address | postCode | buyerPhone | uniformTitle | uniformNumber
   */
  invoice: any;
  /**
   * An array relationship
   */
  order_products: GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_products[];
  /**
   * An array relationship
   */
  order_contacts: GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log_order_contacts[];
}

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC {
  /**
   * fetch data from the table: "order_log"
   */
  order_log: GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC_order_log[];
}

export interface GET_ORDER_LOGS_WITH_MERCHANDISE_SPECVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PAGE
// ====================================================

export interface GET_PAGE_app_page_app_page_sections {
  __typename: "app_page_section";
  id: any;
  options: any | null;
  type: string;
}

export interface GET_PAGE_app_page {
  __typename: "app_page";
  id: any;
  path: string;
  /**
   * An array relationship
   */
  app_page_sections: GET_PAGE_app_page_app_page_sections[];
}

export interface GET_PAGE {
  /**
   * fetch data from the table: "app_page"
   */
  app_page: GET_PAGE_app_page[];
}

export interface GET_PAGEVariables {
  path?: string | null;
  appId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PODCAST_PROGRAM_COLLECTION
// ====================================================

export interface GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles {
  __typename: "podcast_program_role";
  id: any;
  /**
   * An object relationship
   */
  member: GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles_member | null;
}

export interface GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_categories {
  __typename: "podcast_program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_categories_category;
}

export interface GET_PODCAST_PROGRAM_COLLECTION_podcast_program {
  __typename: "podcast_program";
  id: any;
  cover_url: string | null;
  title: string;
  abstract: string | null;
  duration: any;
  duration_second: any;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  published_at: any | null;
  support_locales: any | null;
  /**
   * An array relationship
   */
  podcast_program_roles: GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_roles[];
  /**
   * An array relationship
   */
  podcast_program_categories: GET_PODCAST_PROGRAM_COLLECTION_podcast_program_podcast_program_categories[];
}

export interface GET_PODCAST_PROGRAM_COLLECTION {
  /**
   * fetch data from the table: "podcast_program"
   */
  podcast_program: GET_PODCAST_PROGRAM_COLLECTION_podcast_program[];
}

export interface GET_PODCAST_PROGRAM_COLLECTIONVariables {
  creatorId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PODCAST_PLAN_IDS
// ====================================================

export interface GET_PODCAST_PLAN_IDS_podcast_plan {
  __typename: "podcast_plan";
  id: any;
}

export interface GET_PODCAST_PLAN_IDS {
  /**
   * fetch data from the table: "podcast_plan"
   */
  podcast_plan: GET_PODCAST_PLAN_IDS_podcast_plan[];
}

export interface GET_PODCAST_PLAN_IDSVariables {
  creatorId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PODCAST_PROGRAM_IDS
// ====================================================

export interface GET_ENROLLED_PODCAST_PROGRAM_IDS_podcast_program_enrollment {
  __typename: "podcast_program_enrollment";
  podcast_program_id: any | null;
}

export interface GET_ENROLLED_PODCAST_PROGRAM_IDS {
  /**
   * fetch data from the table: "podcast_program_enrollment"
   */
  podcast_program_enrollment: GET_ENROLLED_PODCAST_PROGRAM_IDS_podcast_program_enrollment[];
}

export interface GET_ENROLLED_PODCAST_PROGRAM_IDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PODCAST_PROGRAMS
// ====================================================

export interface GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_categories {
  __typename: "podcast_program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_categories_category;
}

export interface GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_roles_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_roles {
  __typename: "podcast_program_role";
  id: any;
  /**
   * An object relationship
   */
  member: GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_roles_member | null;
}

export interface GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program {
  __typename: "podcast_program";
  id: any;
  cover_url: string | null;
  title: string;
  abstract: string | null;
  duration: any;
  duration_second: any;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  published_at: any | null;
  support_locales: any | null;
  /**
   * An array relationship
   */
  podcast_program_categories: GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_categories[];
  /**
   * An array relationship
   */
  podcast_program_roles: GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program_podcast_program_roles[];
}

export interface GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment {
  __typename: "podcast_program_enrollment";
  /**
   * An object relationship
   */
  podcast_program: GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment_podcast_program | null;
}

export interface GET_ENROLLED_PODCAST_PROGRAMS {
  /**
   * fetch data from the table: "podcast_program_enrollment"
   */
  podcast_program_enrollment: GET_ENROLLED_PODCAST_PROGRAMS_podcast_program_enrollment[];
}

export interface GET_ENROLLED_PODCAST_PROGRAMSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_PODCAST_PLANS
// ====================================================

export interface GET_PUBLISHED_PODCAST_PLANS_podcast_plan {
  __typename: "podcast_plan";
  id: any;
  creator_id: string;
  is_subscription: boolean;
  period_amount: any;
  period_type: string;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
}

export interface GET_PUBLISHED_PODCAST_PLANS {
  /**
   * fetch data from the table: "podcast_plan"
   */
  podcast_plan: GET_PUBLISHED_PODCAST_PLANS_podcast_plan[];
}

export interface GET_PUBLISHED_PODCAST_PLANSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PODCAST_PLAN
// ====================================================

export interface GET_ENROLLED_PODCAST_PLAN_podcast_plan_enrollment_podcast_plan_creator {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_ENROLLED_PODCAST_PLAN_podcast_plan_enrollment_podcast_plan {
  __typename: "podcast_plan";
  /**
   * An object relationship
   */
  creator: GET_ENROLLED_PODCAST_PLAN_podcast_plan_enrollment_podcast_plan_creator | null;
}

export interface GET_ENROLLED_PODCAST_PLAN_podcast_plan_enrollment {
  __typename: "podcast_plan_enrollment";
  /**
   * An object relationship
   */
  podcast_plan: GET_ENROLLED_PODCAST_PLAN_podcast_plan_enrollment_podcast_plan | null;
}

export interface GET_ENROLLED_PODCAST_PLAN {
  /**
   * fetch data from the table: "podcast_plan_enrollment"
   */
  podcast_plan_enrollment: GET_ENROLLED_PODCAST_PLAN_podcast_plan_enrollment[];
}

export interface GET_ENROLLED_PODCAST_PLANVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PODCAST_PROGRAM_WITH_BODY
// ====================================================

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_categories {
  __typename: "podcast_program_category";
  /**
   * An object relationship
   */
  category: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_categories_category;
}

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_tags_tag {
  __typename: "tag";
  name: string;
}

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_tags {
  __typename: "podcast_program_tag";
  /**
   * An object relationship
   */
  tag: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_tags_tag;
}

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_body {
  __typename: "podcast_program_body";
  description: string | null;
}

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_roles {
  __typename: "podcast_program_role";
  /**
   * instructor
   */
  name: string;
  member_id: string;
}

export interface GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk {
  __typename: "podcast_program";
  id: any;
  title: string;
  cover_url: string | null;
  abstract: string | null;
  content_type: string | null;
  filename: string | null;
  published_at: any | null;
  creator_id: string;
  /**
   * An array relationship
   */
  podcast_program_categories: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_categories[];
  /**
   * An array relationship
   */
  podcast_program_tags: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_tags[];
  /**
   * An object relationship
   */
  podcast_program_body: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_body | null;
  /**
   * An array relationship
   */
  podcast_program_roles: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk_podcast_program_roles[];
}

export interface GET_PODCAST_PROGRAM_WITH_BODY {
  /**
   * fetch data from the table: "podcast_program" using primary key columns
   */
  podcast_program_by_pk: GET_PODCAST_PROGRAM_WITH_BODY_podcast_program_by_pk | null;
}

export interface GET_PODCAST_PROGRAM_WITH_BODYVariables {
  podcastProgramId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PLAYLIST_COLLECTION
// ====================================================

export interface GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs {
  __typename: "playlist_podcast_program";
  id: any;
  podcast_program_id: any;
}

export interface GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs_aggregate_aggregate_max {
  __typename: "playlist_podcast_program_max_fields";
  position: number | null;
}

export interface GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs_aggregate_aggregate {
  __typename: "playlist_podcast_program_aggregate_fields";
  max: GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs_aggregate_aggregate_max | null;
}

export interface GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs_aggregate {
  __typename: "playlist_podcast_program_aggregate";
  aggregate: GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs_aggregate_aggregate | null;
}

export interface GET_PLAYLIST_COLLECTION_playlist {
  __typename: "playlist";
  id: any;
  title: string;
  /**
   * An array relationship
   */
  playlist_podcast_programs: GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs[];
  /**
   * An aggregated array relationship
   */
  playlist_podcast_programs_aggregate: GET_PLAYLIST_COLLECTION_playlist_playlist_podcast_programs_aggregate;
}

export interface GET_PLAYLIST_COLLECTION_podcast_program_enrollment_aggregate_aggregate {
  __typename: "podcast_program_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PLAYLIST_COLLECTION_podcast_program_enrollment_aggregate {
  __typename: "podcast_program_enrollment_aggregate";
  aggregate: GET_PLAYLIST_COLLECTION_podcast_program_enrollment_aggregate_aggregate | null;
}

export interface GET_PLAYLIST_COLLECTION {
  /**
   * fetch data from the table: "playlist"
   */
  playlist: GET_PLAYLIST_COLLECTION_playlist[];
  /**
   * fetch aggregated fields from the table: "podcast_program_enrollment"
   */
  podcast_program_enrollment_aggregate: GET_PLAYLIST_COLLECTION_podcast_program_enrollment_aggregate;
}

export interface GET_PLAYLIST_COLLECTIONVariables {
  memberId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CREATE_PLAYLIST
// ====================================================

export interface CREATE_PLAYLIST_insert_playlist {
  __typename: "playlist_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface CREATE_PLAYLIST {
  /**
   * insert data into the table: "playlist"
   */
  insert_playlist: CREATE_PLAYLIST_insert_playlist | null;
}

export interface CREATE_PLAYLISTVariables {
  memberId: string;
  title: string;
  position: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_PLAYLIST
// ====================================================

export interface UPDATE_PLAYLIST_update_playlist {
  __typename: "playlist_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_PLAYLIST {
  /**
   * update data of the table: "playlist"
   */
  update_playlist: UPDATE_PLAYLIST_update_playlist | null;
}

export interface UPDATE_PLAYLISTVariables {
  playlistId: any;
  title: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_PLAYLIST_POSITION
// ====================================================

export interface UPDATE_PLAYLIST_POSITION_insert_playlist {
  __typename: "playlist_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_PLAYLIST_POSITION {
  /**
   * insert data into the table: "playlist"
   */
  insert_playlist: UPDATE_PLAYLIST_POSITION_insert_playlist | null;
}

export interface UPDATE_PLAYLIST_POSITIONVariables {
  data: playlist_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_PLAYLIST
// ====================================================

export interface DELETE_PLAYLIST_delete_playlist_podcast_program {
  __typename: "playlist_podcast_program_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_PLAYLIST_delete_playlist {
  __typename: "playlist_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_PLAYLIST {
  /**
   * delete data from the table: "playlist_podcast_program"
   */
  delete_playlist_podcast_program: DELETE_PLAYLIST_delete_playlist_podcast_program | null;
  /**
   * delete data from the table: "playlist"
   */
  delete_playlist: DELETE_PLAYLIST_delete_playlist | null;
}

export interface DELETE_PLAYLISTVariables {
  playlistId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PLAYLIST_PODCAST_PROGRAMS
// ====================================================

export interface GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program_podcast_program_podcast_program_roles_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
}

export interface GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program_podcast_program_podcast_program_roles {
  __typename: "podcast_program_role";
  id: any;
  /**
   * An object relationship
   */
  member: GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program_podcast_program_podcast_program_roles_member | null;
}

export interface GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program_podcast_program {
  __typename: "podcast_program";
  id: any;
  cover_url: string | null;
  title: string;
  duration: any;
  duration_second: any;
  /**
   * An array relationship
   */
  podcast_program_roles: GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program_podcast_program_podcast_program_roles[];
}

export interface GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program {
  __typename: "playlist_podcast_program";
  id: any;
  /**
   * An object relationship
   */
  podcast_program: GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program_podcast_program;
}

export interface GET_PLAYLIST_PODCAST_PROGRAMS {
  /**
   * fetch data from the table: "playlist_podcast_program"
   */
  playlist_podcast_program: GET_PLAYLIST_PODCAST_PROGRAMS_playlist_podcast_program[];
}

export interface GET_PLAYLIST_PODCAST_PROGRAMSVariables {
  playlistId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_PODCAST_PROGRAMS
// ====================================================

export interface DELETE_PODCAST_PROGRAMS_delete_playlist_podcast_program {
  __typename: "playlist_podcast_program_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_PODCAST_PROGRAMS {
  /**
   * delete data from the table: "playlist_podcast_program"
   */
  delete_playlist_podcast_program: DELETE_PODCAST_PROGRAMS_delete_playlist_podcast_program | null;
}

export interface DELETE_PODCAST_PROGRAMSVariables {
  podcastProgramId?: any | null;
  playlistIds: any[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_PODCAST_PROGRAMS
// ====================================================

export interface INSERT_PODCAST_PROGRAMS_insert_playlist_podcast_program {
  __typename: "playlist_podcast_program_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_PODCAST_PROGRAMS {
  /**
   * insert data into the table: "playlist_podcast_program"
   */
  insert_playlist_podcast_program: INSERT_PODCAST_PROGRAMS_insert_playlist_podcast_program | null;
}

export interface INSERT_PODCAST_PROGRAMSVariables {
  data: playlist_podcast_program_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_PODCAST_PROGRAM_POSITIONS
// ====================================================

export interface UPDATE_PODCAST_PROGRAM_POSITIONS_delete_playlist_podcast_program {
  __typename: "playlist_podcast_program_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_PODCAST_PROGRAM_POSITIONS_insert_playlist_podcast_program {
  __typename: "playlist_podcast_program_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_PODCAST_PROGRAM_POSITIONS {
  /**
   * delete data from the table: "playlist_podcast_program"
   */
  delete_playlist_podcast_program: UPDATE_PODCAST_PROGRAM_POSITIONS_delete_playlist_podcast_program | null;
  /**
   * insert data into the table: "playlist_podcast_program"
   */
  insert_playlist_podcast_program: UPDATE_PODCAST_PROGRAM_POSITIONS_insert_playlist_podcast_program | null;
}

export interface UPDATE_PODCAST_PROGRAM_POSITIONSVariables {
  playlistId: any;
  data: playlist_podcast_program_insert_input[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRACTICE
// ====================================================

export interface GET_PRACTICE_practice_practice_reactions {
  __typename: "practice_reaction";
  member_id: string;
}

export interface GET_PRACTICE_practice_practice_reactions_aggregate_aggregate {
  __typename: "practice_reaction_aggregate_fields";
  count: number | null;
}

export interface GET_PRACTICE_practice_practice_reactions_aggregate {
  __typename: "practice_reaction_aggregate";
  aggregate: GET_PRACTICE_practice_practice_reactions_aggregate_aggregate | null;
}

export interface GET_PRACTICE_practice_program_content_program_content_section_program_program_roles {
  __typename: "program_role";
  id: any;
  /**
   * instructor / assistant 
   */
  name: string;
  member_id: string;
}

export interface GET_PRACTICE_practice_program_content_program_content_section_program {
  __typename: "program";
  id: any;
  title: string;
  /**
   * An array relationship
   */
  program_roles: GET_PRACTICE_practice_program_content_program_content_section_program_program_roles[];
}

export interface GET_PRACTICE_practice_program_content_program_content_section {
  __typename: "program_content_section";
  /**
   * An object relationship
   */
  program: GET_PRACTICE_practice_program_content_program_content_section_program;
}

export interface GET_PRACTICE_practice_program_content {
  __typename: "program_content";
  id: any;
  title: string;
  metadata: any | null;
  /**
   * An object relationship
   */
  program_content_section: GET_PRACTICE_practice_program_content_program_content_section;
}

export interface GET_PRACTICE_practice_practice_attachments {
  __typename: "practice_attachment";
  attachment_id: any | null;
  data: any | null;
  options: any | null;
}

export interface GET_PRACTICE_practice_practice_suggests_aggregate_aggregate {
  __typename: "practice_issue_aggregate_fields";
  count: number | null;
}

export interface GET_PRACTICE_practice_practice_suggests_aggregate {
  __typename: "practice_issue_aggregate";
  aggregate: GET_PRACTICE_practice_practice_suggests_aggregate_aggregate | null;
}

export interface GET_PRACTICE_practice_practice_suggests_suggest_suggest_reactions {
  __typename: "issue_reaction";
  id: any;
  member_id: string;
}

export interface GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies_aggregate_aggregate {
  __typename: "issue_reply_aggregate_fields";
  count: number | null;
}

export interface GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies_aggregate {
  __typename: "issue_reply_aggregate";
  aggregate: GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies_aggregate_aggregate | null;
}

export interface GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies_suggest_reply_reactions {
  __typename: "issue_reply_reaction";
  member_id: string;
}

export interface GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies {
  __typename: "issue_reply";
  id: any;
  content: string;
  created_at: any;
  member_id: string;
  /**
   * An array relationship
   */
  suggest_reply_reactions: GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies_suggest_reply_reactions[];
}

export interface GET_PRACTICE_practice_practice_suggests_suggest {
  __typename: "issue";
  id: any;
  description: string;
  created_at: any;
  member_id: string;
  /**
   * An array relationship
   */
  suggest_reactions: GET_PRACTICE_practice_practice_suggests_suggest_suggest_reactions[];
  /**
   * An aggregated array relationship
   */
  suggest_replies_aggregate: GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies_aggregate;
  /**
   * An array relationship
   */
  suggest_replies: GET_PRACTICE_practice_practice_suggests_suggest_suggest_replies[];
}

export interface GET_PRACTICE_practice_practice_suggests {
  __typename: "practice_issue";
  /**
   * An object relationship
   */
  suggest: GET_PRACTICE_practice_practice_suggests_suggest | null;
}

export interface GET_PRACTICE_practice {
  __typename: "practice";
  id: any;
  title: string;
  cover_url: string | null;
  created_at: any;
  updated_at: any;
  member_id: string;
  description: string | null;
  /**
   * An array relationship
   */
  practice_reactions: GET_PRACTICE_practice_practice_reactions[];
  /**
   * An aggregated array relationship
   */
  practice_reactions_aggregate: GET_PRACTICE_practice_practice_reactions_aggregate;
  /**
   * An object relationship
   */
  program_content: GET_PRACTICE_practice_program_content;
  /**
   * An array relationship
   */
  practice_attachments: GET_PRACTICE_practice_practice_attachments[];
  /**
   * An aggregated array relationship
   */
  practice_suggests_aggregate: GET_PRACTICE_practice_practice_suggests_aggregate;
  /**
   * An array relationship
   */
  practice_suggests: GET_PRACTICE_practice_practice_suggests[];
}

export interface GET_PRACTICE {
  /**
   * fetch data from the table: "practice"
   */
  practice: GET_PRACTICE_practice[];
}

export interface GET_PRACTICEVariables {
  practiceId?: any | null;
  memberId?: string | null;
  programContentId?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRACTICE_COLLECTION
// ====================================================

export interface GET_PRACTICE_COLLECTION_practice_practice_reactions {
  __typename: "practice_reaction";
  member_id: string;
}

export interface GET_PRACTICE_COLLECTION_practice_practice_reactions_aggregate_aggregate {
  __typename: "practice_reaction_aggregate_fields";
  count: number | null;
}

export interface GET_PRACTICE_COLLECTION_practice_practice_reactions_aggregate {
  __typename: "practice_reaction_aggregate";
  aggregate: GET_PRACTICE_COLLECTION_practice_practice_reactions_aggregate_aggregate | null;
}

export interface GET_PRACTICE_COLLECTION_practice_program_content {
  __typename: "program_content";
  id: any;
  title: string;
  metadata: any | null;
}

export interface GET_PRACTICE_COLLECTION_practice_practice_issues_aggregate_aggregate {
  __typename: "practice_issue_aggregate_fields";
  count: number | null;
}

export interface GET_PRACTICE_COLLECTION_practice_practice_issues_aggregate {
  __typename: "practice_issue_aggregate";
  aggregate: GET_PRACTICE_COLLECTION_practice_practice_issues_aggregate_aggregate | null;
}

export interface GET_PRACTICE_COLLECTION_practice {
  __typename: "practice";
  id: any;
  title: string;
  cover_url: string | null;
  member_id: string;
  created_at: any;
  updated_at: any;
  /**
   * An array relationship
   */
  practice_reactions: GET_PRACTICE_COLLECTION_practice_practice_reactions[];
  /**
   * An aggregated array relationship
   */
  practice_reactions_aggregate: GET_PRACTICE_COLLECTION_practice_practice_reactions_aggregate;
  /**
   * An object relationship
   */
  program_content: GET_PRACTICE_COLLECTION_practice_program_content;
  /**
   * An aggregated array relationship
   */
  practice_issues_aggregate: GET_PRACTICE_COLLECTION_practice_practice_issues_aggregate;
}

export interface GET_PRACTICE_COLLECTION {
  /**
   * fetch data from the table: "practice"
   */
  practice: GET_PRACTICE_COLLECTION_practice[];
}

export interface GET_PRACTICE_COLLECTIONVariables {
  programContentId?: any | null;
  memberId?: string | null;
  programId?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_PRACTICE
// ====================================================

export interface INSERT_PRACTICE_insert_practice_returning {
  __typename: "practice";
  id: any;
}

export interface INSERT_PRACTICE_insert_practice {
  __typename: "practice_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: INSERT_PRACTICE_insert_practice_returning[];
}

export interface INSERT_PRACTICE {
  /**
   * insert data into the table: "practice"
   */
  insert_practice: INSERT_PRACTICE_insert_practice | null;
}

export interface INSERT_PRACTICEVariables {
  title: string;
  memberId: string;
  description?: string | null;
  coverUrl?: string | null;
  programContentId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_PRACTICE
// ====================================================

export interface UPDATE_PRACTICE_update_practice {
  __typename: "practice_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_PRACTICE {
  /**
   * update data of the table: "practice"
   */
  update_practice: UPDATE_PRACTICE_update_practice | null;
}

export interface UPDATE_PRACTICEVariables {
  practiceId: any;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_PRACTICE
// ====================================================

export interface DELETE_PRACTICE_update_practice {
  __typename: "practice_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_PRACTICE {
  /**
   * update data of the table: "practice"
   */
  update_practice: DELETE_PRACTICE_update_practice | null;
}

export interface DELETE_PRACTICEVariables {
  practiceId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_PRACTICE_REACTION
// ====================================================

export interface INSERT_PRACTICE_REACTION_insert_practice_reaction {
  __typename: "practice_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface INSERT_PRACTICE_REACTION {
  /**
   * insert data into the table: "practice_reaction"
   */
  insert_practice_reaction: INSERT_PRACTICE_REACTION_insert_practice_reaction | null;
}

export interface INSERT_PRACTICE_REACTIONVariables {
  memberId: string;
  practiceId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_PRACTICE_REACTION
// ====================================================

export interface DELETE_PRACTICE_REACTION_delete_practice_reaction {
  __typename: "practice_reaction_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_PRACTICE_REACTION {
  /**
   * delete data from the table: "practice_reaction"
   */
  delete_practice_reaction: DELETE_PRACTICE_REACTION_delete_practice_reaction | null;
}

export interface DELETE_PRACTICE_REACTIONVariables {
  memberId: string;
  practiceId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_PROGRAM_COLLECTION
// ====================================================

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories {
  __typename: "program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories_category;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_roles {
  __typename: "program_role";
  id: any;
  /**
   * instructor / assistant 
   */
  name: string;
  member_id: string;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_plans_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
  name: string;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_plans {
  __typename: "program_plan";
  id: any;
  /**
   * 1 - subscribe all / 2 - subscribe from now / 3 - all
   */
  type: number;
  title: string;
  description: string | null;
  gains: any | null;
  /**
   * An object relationship
   */
  currency: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_plans_currency;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  period_amount: any | null;
  period_type: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_participants_visible: boolean;
  published_at: any | null;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate_sum {
  __typename: "program_content_sum_fields";
  duration: any | null;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate {
  __typename: "program_content_aggregate_fields";
  sum: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate_sum | null;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate {
  __typename: "program_content_aggregate";
  aggregate: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate_aggregate | null;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections {
  __typename: "program_content_section";
  id: any;
  /**
   * An aggregated array relationship
   */
  program_contents_aggregate: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections_program_contents_aggregate;
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION_program {
  __typename: "program";
  id: any;
  cover_url: string | null;
  title: string;
  abstract: string | null;
  support_locales: any | null;
  published_at: any | null;
  is_subscription: boolean;
  is_sold_out: boolean | null;
  is_private: boolean;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  /**
   * An array relationship
   */
  program_categories: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_categories[];
  /**
   * An array relationship
   */
  program_roles: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_roles[];
  /**
   * An array relationship
   */
  program_plans: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_plans[];
  /**
   * An array relationship
   */
  program_content_sections: GET_PUBLISHED_PROGRAM_COLLECTION_program_program_content_sections[];
}

export interface GET_PUBLISHED_PROGRAM_COLLECTION {
  /**
   * fetch data from the table: "program"
   */
  program: GET_PUBLISHED_PROGRAM_COLLECTION_program[];
}

export interface GET_PUBLISHED_PROGRAM_COLLECTIONVariables {
  instructorId?: string | null;
  isPrivate?: boolean | null;
  categoryId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_LATEST_PROGRAM_IDS
// ====================================================

export interface GET_LATEST_PROGRAM_IDS_program {
  __typename: "program";
  id: any;
  support_locales: any | null;
}

export interface GET_LATEST_PROGRAM_IDS {
  /**
   * fetch data from the table: "program"
   */
  program: GET_LATEST_PROGRAM_IDS_program[];
}

export interface GET_LATEST_PROGRAM_IDSVariables {
  limit?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM
// ====================================================

export interface GET_PROGRAM_program_by_pk_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PROGRAM_program_by_pk_program_categories {
  __typename: "program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PROGRAM_program_by_pk_program_categories_category;
}

export interface GET_PROGRAM_program_by_pk_program_tags_tag {
  __typename: "tag";
  name: string;
}

export interface GET_PROGRAM_program_by_pk_program_tags {
  __typename: "program_tag";
  /**
   * An object relationship
   */
  tag: GET_PROGRAM_program_by_pk_program_tags_tag;
}

export interface GET_PROGRAM_program_by_pk_program_roles {
  __typename: "program_role";
  id: any;
  /**
   * instructor / assistant 
   */
  name: string;
  member_id: string;
}

export interface GET_PROGRAM_program_by_pk_program_plans_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
  name: string;
}

export interface GET_PROGRAM_program_by_pk_program_plans {
  __typename: "program_plan";
  id: any;
  /**
   * 1 - subscribe all / 2 - subscribe from now / 3 - all
   */
  type: number;
  title: string;
  description: string | null;
  gains: any | null;
  /**
   * An object relationship
   */
  currency: GET_PROGRAM_program_by_pk_program_plans_currency;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  period_amount: any | null;
  period_type: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_participants_visible: boolean;
  published_at: any | null;
  is_countdown_timer_visible: boolean;
}

export interface GET_PROGRAM_program_by_pk_program_content_sections_program_contents_program_content_type {
  __typename: "program_content_type";
  id: any | null;
  type: string | null;
}

export interface GET_PROGRAM_program_by_pk_program_content_sections_program_contents_program_content_materials {
  __typename: "program_content_material";
  id: any;
  data: any | null;
  created_at: any | null;
}

export interface GET_PROGRAM_program_by_pk_program_content_sections_program_contents {
  __typename: "program_content";
  id: any;
  title: string;
  abstract: string | null;
  metadata: any | null;
  /**
   * sec
   */
  duration: any | null;
  published_at: any | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  /**
   * An object relationship
   */
  program_content_type: GET_PROGRAM_program_by_pk_program_content_sections_program_contents_program_content_type | null;
  /**
   * An array relationship
   */
  program_content_materials: GET_PROGRAM_program_by_pk_program_content_sections_program_contents_program_content_materials[];
}

export interface GET_PROGRAM_program_by_pk_program_content_sections_program_contents_aggregate_aggregate {
  __typename: "program_content_aggregate_fields";
  count: number | null;
}

export interface GET_PROGRAM_program_by_pk_program_content_sections_program_contents_aggregate {
  __typename: "program_content_aggregate";
  aggregate: GET_PROGRAM_program_by_pk_program_content_sections_program_contents_aggregate_aggregate | null;
}

export interface GET_PROGRAM_program_by_pk_program_content_sections {
  __typename: "program_content_section";
  id: any;
  title: string;
  description: string | null;
  /**
   * An array relationship
   */
  program_contents: GET_PROGRAM_program_by_pk_program_content_sections_program_contents[];
  /**
   * An aggregated array relationship
   */
  program_contents_aggregate: GET_PROGRAM_program_by_pk_program_content_sections_program_contents_aggregate;
}

export interface GET_PROGRAM_program_by_pk {
  __typename: "program";
  id: any;
  cover_url: string | null;
  title: string;
  abstract: string | null;
  published_at: any | null;
  is_subscription: boolean;
  is_sold_out: boolean | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  description: string | null;
  cover_video_url: string | null;
  is_issues_open: boolean;
  is_private: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An array relationship
   */
  program_categories: GET_PROGRAM_program_by_pk_program_categories[];
  /**
   * An array relationship
   */
  program_tags: GET_PROGRAM_program_by_pk_program_tags[];
  /**
   * An array relationship
   */
  program_roles: GET_PROGRAM_program_by_pk_program_roles[];
  /**
   * An array relationship
   */
  program_plans: GET_PROGRAM_program_by_pk_program_plans[];
  /**
   * An array relationship
   */
  program_content_sections: GET_PROGRAM_program_by_pk_program_content_sections[];
}

export interface GET_PROGRAM {
  /**
   * fetch data from the table: "program" using primary key columns
   */
  program_by_pk: GET_PROGRAM_program_by_pk | null;
}

export interface GET_PROGRAMVariables {
  programId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_CONTENT
// ====================================================

export interface GET_PROGRAM_CONTENT_program_content_by_pk_program_content_plans_program_plan {
  __typename: "program_plan";
  id: any;
  title: string;
}

export interface GET_PROGRAM_CONTENT_program_content_by_pk_program_content_plans {
  __typename: "program_content_plan";
  id: any;
  /**
   * An object relationship
   */
  program_plan: GET_PROGRAM_CONTENT_program_content_by_pk_program_content_plans_program_plan;
}

export interface GET_PROGRAM_CONTENT_program_content_by_pk_program_content_body {
  __typename: "program_content_body";
  id: any;
  description: string | null;
  data: any | null;
  type: string | null;
}

export interface GET_PROGRAM_CONTENT_program_content_by_pk_program_content_materials {
  __typename: "program_content_material";
  id: any;
  data: any | null;
  created_at: any | null;
}

export interface GET_PROGRAM_CONTENT_program_content_by_pk_program_content_attachments {
  __typename: "program_content_attachment";
  attachment_id: any | null;
  data: any | null;
  options: any | null;
  created_at: any | null;
}

export interface GET_PROGRAM_CONTENT_program_content_by_pk {
  __typename: "program_content";
  id: any;
  title: string;
  abstract: string | null;
  created_at: any;
  published_at: any | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  metadata: any | null;
  /**
   * sec
   */
  duration: any | null;
  /**
   * An array relationship
   */
  program_content_plans: GET_PROGRAM_CONTENT_program_content_by_pk_program_content_plans[];
  /**
   * An object relationship
   */
  program_content_body: GET_PROGRAM_CONTENT_program_content_by_pk_program_content_body;
  /**
   * An array relationship
   */
  program_content_materials: GET_PROGRAM_CONTENT_program_content_by_pk_program_content_materials[];
  /**
   * An array relationship
   */
  program_content_attachments: GET_PROGRAM_CONTENT_program_content_by_pk_program_content_attachments[];
}

export interface GET_PROGRAM_CONTENT {
  /**
   * fetch data from the table: "program_content" using primary key columns
   */
  program_content_by_pk: GET_PROGRAM_CONTENT_program_content_by_pk | null;
}

export interface GET_PROGRAM_CONTENTVariables {
  programContentId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROGRAMS
// ====================================================

export interface GET_ENROLLED_PROGRAMS_program_enrollment {
  __typename: "program_enrollment";
  program_id: any | null;
}

export interface GET_ENROLLED_PROGRAMS_program_plan_enrollment_program_plan {
  __typename: "program_plan";
  id: any;
  program_id: any;
}

export interface GET_ENROLLED_PROGRAMS_program_plan_enrollment {
  __typename: "program_plan_enrollment";
  /**
   * An object relationship
   */
  program_plan: GET_ENROLLED_PROGRAMS_program_plan_enrollment_program_plan | null;
}

export interface GET_ENROLLED_PROGRAMS_program_content_enrollment {
  __typename: "program_content_enrollment";
  program_id: any | null;
}

export interface GET_ENROLLED_PROGRAMS {
  /**
   * fetch data from the table: "program_enrollment"
   */
  program_enrollment: GET_ENROLLED_PROGRAMS_program_enrollment[];
  /**
   * fetch data from the table: "program_plan_enrollment"
   */
  program_plan_enrollment: GET_ENROLLED_PROGRAMS_program_plan_enrollment[];
  /**
   * fetch data from the table: "program_content_enrollment"
   */
  program_content_enrollment: GET_ENROLLED_PROGRAMS_program_content_enrollment[];
}

export interface GET_ENROLLED_PROGRAMSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROGRAM_PLANS
// ====================================================

export interface GET_ENROLLED_PROGRAM_PLANS_program_plan_enrollment {
  __typename: "program_plan_enrollment";
  program_plan_id: any | null;
}

export interface GET_ENROLLED_PROGRAM_PLANS {
  /**
   * fetch data from the table: "program_plan_enrollment"
   */
  program_plan_enrollment: GET_ENROLLED_PROGRAM_PLANS_program_plan_enrollment[];
}

export interface GET_ENROLLED_PROGRAM_PLANSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_PLAN_ENROLLMENT
// ====================================================

export interface GET_PROGRAM_PLAN_ENROLLMENT_program_plan_enrollment_aggregate_aggregate {
  __typename: "program_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PROGRAM_PLAN_ENROLLMENT_program_plan_enrollment_aggregate {
  __typename: "program_plan_enrollment_aggregate";
  aggregate: GET_PROGRAM_PLAN_ENROLLMENT_program_plan_enrollment_aggregate_aggregate | null;
}

export interface GET_PROGRAM_PLAN_ENROLLMENT {
  /**
   * fetch aggregated fields from the table: "program_plan_enrollment"
   */
  program_plan_enrollment_aggregate: GET_PROGRAM_PLAN_ENROLLMENT_program_plan_enrollment_aggregate;
}

export interface GET_PROGRAM_PLAN_ENROLLMENTVariables {
  programPlanId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_CONTENT_MATERIAL
// ====================================================

export interface GET_PROGRAM_CONTENT_MATERIAL_program_content_material {
  __typename: "program_content_material";
  id: any;
  data: any | null;
  created_at: any | null;
}

export interface GET_PROGRAM_CONTENT_MATERIAL {
  /**
   * fetch data from the table: "program_content_material"
   */
  program_content_material: GET_PROGRAM_CONTENT_MATERIAL_program_content_material[];
}

export interface GET_PROGRAM_CONTENT_MATERIALVariables {
  programContentId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: INSERT_EXERCISE
// ====================================================

export interface INSERT_EXERCISE_insert_exercise_one {
  __typename: "exercise";
  id: any;
}

export interface INSERT_EXERCISE {
  /**
   * insert a single row into the table: "exercise"
   */
  insert_exercise_one: INSERT_EXERCISE_insert_exercise_one | null;
}

export interface INSERT_EXERCISEVariables {
  data: exercise_insert_input;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_PACKAGE_INTRODUCTION
// ====================================================

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs_program_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs_program_program_categories {
  __typename: "program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs_program_program_categories_category;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs_program {
  __typename: "program";
  id: any;
  title: string;
  cover_url: string | null;
  /**
   * An array relationship
   */
  program_categories: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs_program_program_categories[];
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs {
  __typename: "program_package_program";
  id: any;
  /**
   * An object relationship
   */
  program: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs_program;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_plans_program_package_plan_enrollments_aggregate_aggregate {
  __typename: "program_package_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_plans_program_package_plan_enrollments_aggregate {
  __typename: "program_package_plan_enrollment_aggregate";
  aggregate: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_plans_program_package_plan_enrollments_aggregate_aggregate | null;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_plans {
  __typename: "program_package_plan";
  id: any;
  title: string;
  description: string | null;
  is_subscription: boolean;
  is_participants_visible: boolean;
  period_amount: any;
  period_type: string;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any | null;
  /**
   * An aggregated array relationship
   */
  program_package_plan_enrollments_aggregate: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_plans_program_package_plan_enrollments_aggregate;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk {
  __typename: "program_package";
  id: any;
  title: string;
  cover_url: string | null;
  description: string | null;
  /**
   * An array relationship
   */
  program_package_programs: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_programs[];
  /**
   * An array relationship
   */
  program_package_plans: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk_program_package_plans[];
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTION {
  /**
   * fetch data from the table: "program_package" using primary key columns
   */
  program_package_by_pk: GET_PROGRAM_PACKAGE_INTRODUCTION_program_package_by_pk | null;
}

export interface GET_PROGRAM_PACKAGE_INTRODUCTIONVariables {
  programPackageId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS
// ====================================================

export interface GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS_program_package_plan_enrollment {
  __typename: "program_package_plan_enrollment";
  program_package_plan_id: any | null;
}

export interface GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS {
  /**
   * fetch data from the table: "program_package_plan_enrollment"
   */
  program_package_plan_enrollment: GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS_program_package_plan_enrollment[];
}

export interface GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROGRAM_PACKAGE
// ====================================================

export interface GET_ENROLLED_PROGRAM_PACKAGE_program_package_plan_enrollment_program_package_plan {
  __typename: "program_package_plan";
  program_package_id: any;
}

export interface GET_ENROLLED_PROGRAM_PACKAGE_program_package_plan_enrollment {
  __typename: "program_package_plan_enrollment";
  program_package_plan_id: any | null;
  /**
   * An object relationship
   */
  program_package_plan: GET_ENROLLED_PROGRAM_PACKAGE_program_package_plan_enrollment_program_package_plan | null;
}

export interface GET_ENROLLED_PROGRAM_PACKAGE {
  /**
   * fetch data from the table: "program_package_plan_enrollment"
   */
  program_package_plan_enrollment: GET_ENROLLED_PROGRAM_PACKAGE_program_package_plan_enrollment[];
}

export interface GET_ENROLLED_PROGRAM_PACKAGEVariables {
  memberId: string;
  programPackageId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROGRAM_PACKAGE_CONTENT
// ====================================================

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs_program_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs_program_program_categories {
  __typename: "program_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs_program_program_categories_category;
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs_program {
  __typename: "program";
  id: any;
  cover_url: string | null;
  title: string;
  /**
   * An array relationship
   */
  program_categories: GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs_program_program_categories[];
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs {
  __typename: "program_package_program";
  id: any;
  /**
   * An object relationship
   */
  program: GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs_program;
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk {
  __typename: "program_package";
  id: any;
  cover_url: string | null;
  title: string;
  published_at: any | null;
  /**
   * An array relationship
   */
  program_package_programs: GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk_program_package_programs[];
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_plan_enrollment_program_package_plan {
  __typename: "program_package_plan";
  is_tempo_delivery: boolean;
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_package_plan_enrollment {
  __typename: "program_package_plan_enrollment";
  /**
   * An object relationship
   */
  program_package_plan: GET_PROGRAM_PACKAGE_CONTENT_program_package_plan_enrollment_program_package_plan | null;
}

export interface GET_PROGRAM_PACKAGE_CONTENT_program_tempo_delivery {
  __typename: "program_tempo_delivery";
  delivered_at: any;
  program_package_program_id: any;
}

export interface GET_PROGRAM_PACKAGE_CONTENT {
  /**
   * fetch data from the table: "program_package" using primary key columns
   */
  program_package_by_pk: GET_PROGRAM_PACKAGE_CONTENT_program_package_by_pk | null;
  /**
   * fetch data from the table: "program_package_plan_enrollment"
   */
  program_package_plan_enrollment: GET_PROGRAM_PACKAGE_CONTENT_program_package_plan_enrollment[];
  /**
   * fetch data from the table: "program_tempo_delivery"
   */
  program_tempo_delivery: GET_PROGRAM_PACKAGE_CONTENT_program_tempo_delivery[];
}

export interface GET_PROGRAM_PACKAGE_CONTENTVariables {
  programPackageId: any;
  memberId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS
// ====================================================

export interface GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS_project_plan_enrollment {
  __typename: "project_plan_enrollment";
  member_id: string | null;
  project_plan_id: any | null;
}

export interface GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS {
  /**
   * fetch data from the table: "project_plan_enrollment"
   */
  project_plan_enrollment: GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS_project_plan_enrollment[];
}

export interface GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ENROLLED_PROJECT_PLAN_IDS
// ====================================================

export interface GET_ENROLLED_PROJECT_PLAN_IDS_product_enrollment {
  __typename: "product_enrollment";
  product_id: string | null;
  is_physical: boolean | null;
}

export interface GET_ENROLLED_PROJECT_PLAN_IDS {
  /**
   * fetch data from the table: "product_enrollment"
   */
  product_enrollment: GET_ENROLLED_PROJECT_PLAN_IDS_product_enrollment[];
}

export interface GET_ENROLLED_PROJECT_PLAN_IDSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROJECT
// ====================================================

export interface GET_PROJECT_project_by_pk_project_sales {
  __typename: "project_sales";
  total_sales: any | null;
}

export interface GET_PROJECT_project_by_pk_project_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PROJECT_project_by_pk_project_categories {
  __typename: "project_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PROJECT_project_by_pk_project_categories_category;
}

export interface GET_PROJECT_project_by_pk_project_sections {
  __typename: "project_section";
  id: any;
  type: string;
  /**
   * messenger: https: // github.com/Yoctol/react-messenger-customer-chat#props
   */
  options: any | null;
}

export interface GET_PROJECT_project_by_pk_project_plans_project_plan_inventory_status {
  __typename: "project_plan_inventory_status";
  buyable_quantity: any | null;
}

export interface GET_PROJECT_project_by_pk_project_plans_project_plan_enrollments_aggregate_aggregate {
  __typename: "project_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PROJECT_project_by_pk_project_plans_project_plan_enrollments_aggregate {
  __typename: "project_plan_enrollment_aggregate";
  aggregate: GET_PROJECT_project_by_pk_project_plans_project_plan_enrollments_aggregate_aggregate | null;
}

export interface GET_PROJECT_project_by_pk_project_plans {
  __typename: "project_plan";
  id: any;
  cover_url: string | null;
  title: string;
  description: string | null;
  is_subscription: boolean;
  period_amount: any | null;
  /**
   * Y / M / W / D
   */
  period_type: string | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  created_at: any;
  is_participants_visible: boolean;
  is_physical: boolean;
  is_limited: boolean;
  /**
   * An object relationship
   */
  project_plan_inventory_status: GET_PROJECT_project_by_pk_project_plans_project_plan_inventory_status | null;
  /**
   * An aggregated array relationship
   */
  project_plan_enrollments_aggregate: GET_PROJECT_project_by_pk_project_plans_project_plan_enrollments_aggregate;
}

export interface GET_PROJECT_project_by_pk {
  __typename: "project";
  id: any;
  /**
   * funding / pre-order / on-sale / modular
   */
  type: string;
  title: string;
  /**
   * image / video
   */
  cover_type: string;
  cover_url: string | null;
  preview_url: string | null;
  abstract: string | null;
  description: string | null;
  target_amount: any | null;
  /**
   * funds / participants
   */
  target_unit: string;
  template: string | null;
  introduction: string | null;
  updates: any | null;
  comments: any | null;
  contents: any | null;
  created_at: any;
  published_at: any | null;
  expired_at: any | null;
  is_participants_visible: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An object relationship
   */
  project_sales: GET_PROJECT_project_by_pk_project_sales | null;
  /**
   * An array relationship
   */
  project_categories: GET_PROJECT_project_by_pk_project_categories[];
  /**
   * An array relationship
   */
  project_sections: GET_PROJECT_project_by_pk_project_sections[];
  /**
   * An array relationship
   */
  project_plans: GET_PROJECT_project_by_pk_project_plans[];
}

export interface GET_PROJECT {
  /**
   * fetch data from the table: "project" using primary key columns
   */
  project_by_pk: GET_PROJECT_project_by_pk | null;
}

export interface GET_PROJECTVariables {
  projectId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PROJECT_INTRO_COLLECTION
// ====================================================

export interface GET_PROJECT_INTRO_COLLECTION_project_project_sales {
  __typename: "project_sales";
  total_sales: any | null;
}

export interface GET_PROJECT_INTRO_COLLECTION_project_project_plans_project_plan_enrollments_aggregate_aggregate {
  __typename: "project_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_PROJECT_INTRO_COLLECTION_project_project_plans_project_plan_enrollments_aggregate {
  __typename: "project_plan_enrollment_aggregate";
  aggregate: GET_PROJECT_INTRO_COLLECTION_project_project_plans_project_plan_enrollments_aggregate_aggregate | null;
}

export interface GET_PROJECT_INTRO_COLLECTION_project_project_plans {
  __typename: "project_plan";
  id: any;
  cover_url: string | null;
  title: string;
  description: string | null;
  is_subscription: boolean;
  period_amount: any | null;
  /**
   * Y / M / W / D
   */
  period_type: string | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  created_at: any;
  is_participants_visible: boolean;
  is_physical: boolean;
  is_limited: boolean;
  /**
   * An aggregated array relationship
   */
  project_plan_enrollments_aggregate: GET_PROJECT_INTRO_COLLECTION_project_project_plans_project_plan_enrollments_aggregate;
}

export interface GET_PROJECT_INTRO_COLLECTION_project_project_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PROJECT_INTRO_COLLECTION_project_project_categories {
  __typename: "project_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PROJECT_INTRO_COLLECTION_project_project_categories_category;
}

export interface GET_PROJECT_INTRO_COLLECTION_project {
  __typename: "project";
  id: any;
  /**
   * funding / pre-order / on-sale / modular
   */
  type: string;
  title: string;
  /**
   * image / video
   */
  cover_type: string;
  cover_url: string | null;
  preview_url: string | null;
  abstract: string | null;
  introduction: string | null;
  description: string | null;
  target_amount: any | null;
  /**
   * funds / participants
   */
  target_unit: string;
  expired_at: any | null;
  is_participants_visible: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An object relationship
   */
  project_sales: GET_PROJECT_INTRO_COLLECTION_project_project_sales | null;
  /**
   * An array relationship
   */
  project_plans: GET_PROJECT_INTRO_COLLECTION_project_project_plans[];
  /**
   * An array relationship
   */
  project_categories: GET_PROJECT_INTRO_COLLECTION_project_project_categories[];
}

export interface GET_PROJECT_INTRO_COLLECTION {
  /**
   * fetch data from the table: "project"
   */
  project: GET_PROJECT_INTRO_COLLECTION_project[];
}

export interface GET_PROJECT_INTRO_COLLECTIONVariables {
  condition: project_bool_exp;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_REVIEW_AGGREGATE
// ====================================================

export interface GET_REVIEW_AGGREGATE_review_public_aggregate_aggregate_avg {
  __typename: "review_public_avg_fields";
  score: number | null;
}

export interface GET_REVIEW_AGGREGATE_review_public_aggregate_aggregate {
  __typename: "review_public_aggregate_fields";
  avg: GET_REVIEW_AGGREGATE_review_public_aggregate_aggregate_avg | null;
  count: number | null;
}

export interface GET_REVIEW_AGGREGATE_review_public_aggregate {
  __typename: "review_public_aggregate";
  aggregate: GET_REVIEW_AGGREGATE_review_public_aggregate_aggregate | null;
}

export interface GET_REVIEW_AGGREGATE {
  /**
   * fetch aggregated fields from the table: "review_public"
   */
  review_public_aggregate: GET_REVIEW_AGGREGATE_review_public_aggregate;
}

export interface GET_REVIEW_AGGREGATEVariables {
  path?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_REVIEW_REPLY
// ====================================================

export interface UPDATE_REVIEW_REPLY_update_review_reply {
  __typename: "review_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface UPDATE_REVIEW_REPLY {
  /**
   * update data of the table: "review_reply"
   */
  update_review_reply: UPDATE_REVIEW_REPLY_update_review_reply | null;
}

export interface UPDATE_REVIEW_REPLYVariables {
  id: any;
  memberId?: string | null;
  content?: string | null;
  appId: string;
  updateAt?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DELETE_REVIEW_REPLY
// ====================================================

export interface DELETE_REVIEW_REPLY_delete_review_reply {
  __typename: "review_reply_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DELETE_REVIEW_REPLY {
  /**
   * delete data from the table: "review_reply"
   */
  delete_review_reply: DELETE_REVIEW_REPLY_delete_review_reply | null;
}

export interface DELETE_REVIEW_REPLYVariables {
  id: any;
  memberId?: string | null;
  appId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PRODUCT_EDITOR_IDS
// ====================================================

export interface GET_PRODUCT_EDITOR_IDS_program_program_roles {
  __typename: "program_role";
  id: any;
  member_id: string;
  /**
   * instructor / assistant 
   */
  name: string;
}

export interface GET_PRODUCT_EDITOR_IDS_program {
  __typename: "program";
  /**
   * An array relationship
   */
  program_roles: GET_PRODUCT_EDITOR_IDS_program_program_roles[];
}

export interface GET_PRODUCT_EDITOR_IDS_podcast_program_podcast_program_roles {
  __typename: "podcast_program_role";
  id: any;
  member_id: string;
  /**
   * instructor
   */
  name: string;
}

export interface GET_PRODUCT_EDITOR_IDS_podcast_program {
  __typename: "podcast_program";
  /**
   * An array relationship
   */
  podcast_program_roles: GET_PRODUCT_EDITOR_IDS_podcast_program_podcast_program_roles[];
}

export interface GET_PRODUCT_EDITOR_IDS {
  /**
   * fetch data from the table: "program"
   */
  program: GET_PRODUCT_EDITOR_IDS_program[];
  /**
   * fetch data from the table: "podcast_program"
   */
  podcast_program: GET_PRODUCT_EDITOR_IDS_podcast_program[];
}

export interface GET_PRODUCT_EDITOR_IDSVariables {
  targetId: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ACTIVITY
// ====================================================

export interface GET_ACTIVITY_activity_by_pk_activity_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_ACTIVITY_activity_by_pk_activity_categories {
  __typename: "activity_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_ACTIVITY_activity_by_pk_activity_categories_category;
}

export interface GET_ACTIVITY_activity_by_pk_activity_sessions {
  __typename: "activity_session";
  id: any;
}

export interface GET_ACTIVITY_activity_by_pk_activity_tickets_activity_session_tickets_activity_session {
  __typename: "activity_session";
  id: any;
  title: string;
}

export interface GET_ACTIVITY_activity_by_pk_activity_tickets_activity_session_tickets {
  __typename: "activity_session_ticket";
  id: any;
  /**
   * An object relationship
   */
  activity_session: GET_ACTIVITY_activity_by_pk_activity_tickets_activity_session_tickets_activity_session;
}

export interface GET_ACTIVITY_activity_by_pk_activity_tickets_activity_ticket_enrollments_aggregate_aggregate {
  __typename: "activity_ticket_enrollment_aggregate_fields";
  count: number | null;
}

export interface GET_ACTIVITY_activity_by_pk_activity_tickets_activity_ticket_enrollments_aggregate {
  __typename: "activity_ticket_enrollment_aggregate";
  aggregate: GET_ACTIVITY_activity_by_pk_activity_tickets_activity_ticket_enrollments_aggregate_aggregate | null;
}

export interface GET_ACTIVITY_activity_by_pk_activity_tickets_activity_ticket_enrollments {
  __typename: "activity_ticket_enrollment";
  order_log_id: string | null;
  order_product_id: any | null;
}

export interface GET_ACTIVITY_activity_by_pk_activity_tickets {
  __typename: "activity_ticket";
  id: any;
  /**
   * unlimited as 99999999
   */
  count: number;
  description: string | null;
  started_at: any;
  is_published: boolean;
  ended_at: any;
  price: any;
  title: string;
  /**
   * An array relationship
   */
  activity_session_tickets: GET_ACTIVITY_activity_by_pk_activity_tickets_activity_session_tickets[];
  /**
   * An aggregated array relationship
   */
  activity_ticket_enrollments_aggregate: GET_ACTIVITY_activity_by_pk_activity_tickets_activity_ticket_enrollments_aggregate;
  /**
   * An array relationship
   */
  activity_ticket_enrollments: GET_ACTIVITY_activity_by_pk_activity_tickets_activity_ticket_enrollments[];
}

export interface GET_ACTIVITY_activity_by_pk {
  __typename: "activity";
  id: any;
  organizer_id: string;
  cover_url: string | null;
  title: string;
  description: string | null;
  published_at: any | null;
  /**
   * An array relationship
   */
  activity_categories: GET_ACTIVITY_activity_by_pk_activity_categories[];
  /**
   * An array relationship
   */
  activity_sessions: GET_ACTIVITY_activity_by_pk_activity_sessions[];
  /**
   * An array relationship
   */
  activity_tickets: GET_ACTIVITY_activity_by_pk_activity_tickets[];
}

export interface GET_ACTIVITY {
  /**
   * fetch data from the table: "activity" using primary key columns
   */
  activity_by_pk: GET_ACTIVITY_activity_by_pk | null;
}

export interface GET_ACTIVITYVariables {
  activityId: any;
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AGREE_MEMBER_CONTRACT
// ====================================================

export interface AGREE_MEMBER_CONTRACT_update_member_contract {
  __typename: "member_contract_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface AGREE_MEMBER_CONTRACT {
  /**
   * update data of the table: "member_contract"
   */
  update_member_contract: AGREE_MEMBER_CONTRACT_update_member_contract | null;
}

export interface AGREE_MEMBER_CONTRACTVariables {
  memberContractId: any;
  agreedAt: any;
  agreedIp: string;
  agreedOptions?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_PUBLISHED_CREATOR
// ====================================================

export interface GET_PUBLISHED_CREATOR_creator_member {
  __typename: "member_public";
  title: string | null;
  abstract: string | null;
}

export interface GET_PUBLISHED_CREATOR_creator_creator_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface GET_PUBLISHED_CREATOR_creator_creator_categories {
  __typename: "creator_category";
  id: any;
  /**
   * An object relationship
   */
  category: GET_PUBLISHED_CREATOR_creator_creator_categories_category;
}

export interface GET_PUBLISHED_CREATOR_creator_member_specialities {
  __typename: "member_speciality";
  id: any;
  tag_name: string;
}

export interface GET_PUBLISHED_CREATOR_creator {
  __typename: "creator";
  id: string | null;
  name: string | null;
  picture_url: string | null;
  /**
   * An object relationship
   */
  member: GET_PUBLISHED_CREATOR_creator_member | null;
  /**
   * An array relationship
   */
  creator_categories: GET_PUBLISHED_CREATOR_creator_creator_categories[];
  /**
   * An array relationship
   */
  member_specialities: GET_PUBLISHED_CREATOR_creator_member_specialities[];
}

export interface GET_PUBLISHED_CREATOR {
  /**
   * fetch data from the table: "creator"
   */
  creator: GET_PUBLISHED_CREATOR_creator[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UPDATE_ORDER
// ====================================================

export interface UPDATE_ORDER_update_order_log_by_pk {
  __typename: "order_log";
  id: string;
}

export interface UPDATE_ORDER {
  /**
   * update single row of the table: "order_log"
   */
  update_order_log_by_pk: UPDATE_ORDER_update_order_log_by_pk | null;
}

export interface UPDATE_ORDERVariables {
  orderId: string;
  memberId: string;
  transferredAt: any;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_GROUP_BUYING_ORDER
// ====================================================

export interface GET_GROUP_BUYING_ORDER_order_group_buying_log_parent_order_log_sub_order_logs {
  __typename: "order_log";
  member_id: string;
}

export interface GET_GROUP_BUYING_ORDER_order_group_buying_log_parent_order_log {
  __typename: "order_log";
  /**
   * An array relationship
   */
  sub_order_logs: GET_GROUP_BUYING_ORDER_order_group_buying_log_parent_order_log_sub_order_logs[];
}

export interface GET_GROUP_BUYING_ORDER_order_group_buying_log {
  __typename: "order_group_buying_log";
  parent_order_member_id: string | null;
  parent_order_member_email: string | null;
  order_id: string | null;
  member_id: string | null;
  member_email: string | null;
  started_at: any | null;
  ended_at: any | null;
  transferred_at: any | null;
  name: string | null;
  cover_url: string | null;
  /**
   * An object relationship
   */
  parent_order_log: GET_GROUP_BUYING_ORDER_order_group_buying_log_parent_order_log | null;
}

export interface GET_GROUP_BUYING_ORDER {
  /**
   * fetch data from the table: "order_group_buying_log"
   */
  order_group_buying_log: GET_GROUP_BUYING_ORDER_order_group_buying_log[];
}

export interface GET_GROUP_BUYING_ORDERVariables {
  memberId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_COIN_STATUS
// ====================================================

export interface GET_COIN_STATUS_coin_status {
  __typename: "coin_status";
  remaining: any | null;
}

export interface GET_COIN_STATUS {
  /**
   * fetch data from the table: "coin_status"
   */
  coin_status: GET_COIN_STATUS_coin_status[];
}

export interface GET_COIN_STATUSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_COIN_LOG_COLLECTION
// ====================================================

export interface GET_COIN_LOG_COLLECTION_coin_log {
  __typename: "coin_log";
  id: any;
  title: string;
  description: string;
  created_at: any;
  started_at: any | null;
  ended_at: any | null;
  amount: any;
}

export interface GET_COIN_LOG_COLLECTION {
  /**
   * fetch data from the table: "coin_log"
   */
  coin_log: GET_COIN_LOG_COLLECTION_coin_log[];
}

export interface GET_COIN_LOG_COLLECTIONVariables {
  memberId: string;
  current: any;
  offset?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ORDER_LOG_WITH_COINS_COLLECTION
// ====================================================

export interface GET_ORDER_LOG_WITH_COINS_COLLECTION_order_log_order_discounts {
  __typename: "order_discount";
  id: any;
  name: string;
  options: any | null;
}

export interface GET_ORDER_LOG_WITH_COINS_COLLECTION_order_log {
  __typename: "order_log";
  id: string;
  created_at: any;
  /**
   * An array relationship
   */
  order_discounts: GET_ORDER_LOG_WITH_COINS_COLLECTION_order_log_order_discounts[];
}

export interface GET_ORDER_LOG_WITH_COINS_COLLECTION {
  /**
   * fetch data from the table: "order_log"
   */
  order_log: GET_ORDER_LOG_WITH_COINS_COLLECTION_order_log[];
}

export interface GET_ORDER_LOG_WITH_COINS_COLLECTIONVariables {
  memberId: string;
  offset?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER_CONTRACTS
// ====================================================

export interface GET_MEMBER_CONTRACTS_member_contract_contract {
  __typename: "contract";
  name: string;
}

export interface GET_MEMBER_CONTRACTS_member_contract {
  __typename: "member_contract";
  id: any;
  agreed_at: any | null;
  agreed_ip: string | null;
  agreed_options: any | null;
  revoked_at: any | null;
  started_at: any | null;
  ended_at: any | null;
  /**
   * An object relationship
   */
  contract: GET_MEMBER_CONTRACTS_member_contract_contract;
}

export interface GET_MEMBER_CONTRACTS {
  /**
   * fetch data from the table: "member_contract"
   */
  member_contract: GET_MEMBER_CONTRACTS_member_contract[];
}

export interface GET_MEMBER_CONTRACTSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_POINT_STATUS
// ====================================================

export interface GET_POINT_STATUS_point_status {
  __typename: "point_status";
  points: any | null;
}

export interface GET_POINT_STATUS {
  /**
   * fetch data from the table: "point_status"
   */
  point_status: GET_POINT_STATUS_point_status[];
}

export interface GET_POINT_STATUSVariables {
  memberId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_POINT_LOG_COLLECTION
// ====================================================

export interface GET_POINT_LOG_COLLECTION_point_log {
  __typename: "point_log";
  id: any;
  description: string;
  created_at: any;
  ended_at: any | null;
  point: any;
}

export interface GET_POINT_LOG_COLLECTION {
  /**
   * fetch data from the table: "point_log"
   */
  point_log: GET_POINT_LOG_COLLECTION_point_log[];
}

export interface GET_POINT_LOG_COLLECTIONVariables {
  memberId: string;
  current: any;
  offset?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ORDER_LOG_WITH_POINTS_COLLECTION
// ====================================================

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts {
  __typename: "order_discount";
  id: any;
  name: string;
}

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts_aggregate_aggregate_sum {
  __typename: "order_discount_sum_fields";
  price: any | null;
}

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts_aggregate_aggregate {
  __typename: "order_discount_aggregate_fields";
  sum: GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts_aggregate_aggregate_sum | null;
}

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts_aggregate {
  __typename: "order_discount_aggregate";
  aggregate: GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts_aggregate_aggregate | null;
}

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log {
  __typename: "order_log";
  id: string;
  created_at: any;
  /**
   * An array relationship
   */
  order_discounts: GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts[];
  /**
   * An aggregated array relationship
   */
  order_discounts_aggregate: GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log_order_discounts_aggregate;
}

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTION {
  /**
   * fetch data from the table: "order_log"
   */
  order_log: GET_ORDER_LOG_WITH_POINTS_COLLECTION_order_log[];
}

export interface GET_ORDER_LOG_WITH_POINTS_COLLECTIONVariables {
  memberId: string;
  offset?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_MEMBER_PROGRAM_ISSUES
// ====================================================

export interface GET_MEMBER_PROGRAM_ISSUES_issue_issue_reactions {
  __typename: "issue_reaction";
  member_id: string;
}

export interface GET_MEMBER_PROGRAM_ISSUES_issue_issue_replies_aggregate_aggregate {
  __typename: "issue_reply_aggregate_fields";
  count: number | null;
}

export interface GET_MEMBER_PROGRAM_ISSUES_issue_issue_replies_aggregate {
  __typename: "issue_reply_aggregate";
  aggregate: GET_MEMBER_PROGRAM_ISSUES_issue_issue_replies_aggregate_aggregate | null;
}

export interface GET_MEMBER_PROGRAM_ISSUES_issue {
  __typename: "issue";
  id: any;
  title: string;
  thread_id: string;
  description: string;
  solved_at: any | null;
  created_at: any;
  member_id: string;
  /**
   * An array relationship
   */
  issue_reactions: GET_MEMBER_PROGRAM_ISSUES_issue_issue_reactions[];
  /**
   * An aggregated array relationship
   */
  issue_replies_aggregate: GET_MEMBER_PROGRAM_ISSUES_issue_issue_replies_aggregate;
}

export interface GET_MEMBER_PROGRAM_ISSUES {
  /**
   * fetch data from the table: "issue"
   */
  issue: GET_MEMBER_PROGRAM_ISSUES_issue[];
}

export interface GET_MEMBER_PROGRAM_ISSUESVariables {
  appId: string;
  threadIdLike?: string | null;
  unsolved?: boolean | null;
  memberId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_ORDERS_PRODUCT
// ====================================================

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts_aggregate_aggregate_sum {
  __typename: "order_discount_sum_fields";
  price: any | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts_aggregate_aggregate {
  __typename: "order_discount_aggregate_fields";
  sum: GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts_aggregate_aggregate_sum | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts_aggregate {
  __typename: "order_discount_aggregate";
  aggregate: GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts_aggregate_aggregate | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_products_aggregate_aggregate_sum {
  __typename: "order_product_sum_fields";
  price: any | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_products_aggregate_aggregate {
  __typename: "order_product_aggregate_fields";
  sum: GET_ORDERS_PRODUCT_order_log_by_pk_order_products_aggregate_aggregate_sum | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_products_aggregate {
  __typename: "order_product_aggregate";
  aggregate: GET_ORDERS_PRODUCT_order_log_by_pk_order_products_aggregate_aggregate | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_products {
  __typename: "order_product";
  id: any;
  product_id: string;
  name: string;
  price: any;
  options: any | null;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts {
  __typename: "order_discount";
  /**
   * Coupon / Voucher / Card / DownPrice
   */
  type: string;
  target: string;
}

export interface GET_ORDERS_PRODUCT_order_log_by_pk {
  __typename: "order_log";
  id: string;
  message: string | null;
  /**
   * SUCCESS, MATCHING, REFUND, PARTIAL_REFUND, PARTIAL_EXPIRED, PARTIAL_PAID, EXPIRED, UNPAID
   */
  status: string;
  /**
   * An aggregated array relationship
   */
  order_discounts_aggregate: GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts_aggregate;
  /**
   * An aggregated array relationship
   */
  order_products_aggregate: GET_ORDERS_PRODUCT_order_log_by_pk_order_products_aggregate;
  /**
   * An array relationship
   */
  order_products: GET_ORDERS_PRODUCT_order_log_by_pk_order_products[];
  /**
   * An array relationship
   */
  order_discounts: GET_ORDERS_PRODUCT_order_log_by_pk_order_discounts[];
  shipping: any | null;
  /**
   * name | email | phone | address | postCode | buyerPhone | uniformTitle | uniformNumber
   */
  invoice: any;
}

export interface GET_ORDERS_PRODUCT {
  /**
   * fetch data from the table: "order_log" using primary key columns
   */
  order_log_by_pk: GET_ORDERS_PRODUCT_order_log_by_pk | null;
}

export interface GET_ORDERS_PRODUCTVariables {
  orderId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GET_LAST_EXERCISE
// ====================================================

export interface GET_LAST_EXERCISE_exercise {
  __typename: "exercise";
  id: any;
  answer: any | null;
}

export interface GET_LAST_EXERCISE {
  /**
   * fetch data from the table: "exercise"
   */
  exercise: GET_LAST_EXERCISE_exercise[];
}

export interface GET_LAST_EXERCISEVariables {
  condition: exercise_bool_exp;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SEARCH_PRODUCT_COLLECTION
// ====================================================

export interface SEARCH_PRODUCT_COLLECTION_program_program_content_sections_program_contents {
  __typename: "program_content";
  id: any;
  /**
   * sec
   */
  duration: any | null;
}

export interface SEARCH_PRODUCT_COLLECTION_program_program_content_sections {
  __typename: "program_content_section";
  id: any;
  /**
   * An array relationship
   */
  program_contents: SEARCH_PRODUCT_COLLECTION_program_program_content_sections_program_contents[];
}

export interface SEARCH_PRODUCT_COLLECTION_program_program_plans_currency {
  __typename: "currency";
  id: string;
  label: string;
  unit: string;
  name: string;
}

export interface SEARCH_PRODUCT_COLLECTION_program_program_plans {
  __typename: "program_plan";
  id: any;
  /**
   * 1 - subscribe all / 2 - subscribe from now / 3 - all
   */
  type: number;
  title: string;
  description: string | null;
  gains: any | null;
  /**
   * An object relationship
   */
  currency: SEARCH_PRODUCT_COLLECTION_program_program_plans_currency;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  period_amount: any | null;
  period_type: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_participants_visible: boolean;
  published_at: any | null;
}

export interface SEARCH_PRODUCT_COLLECTION_program_program_roles_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  username: string | null;
  name: string | null;
}

export interface SEARCH_PRODUCT_COLLECTION_program_program_roles {
  __typename: "program_role";
  id: any;
  /**
   * An object relationship
   */
  member: SEARCH_PRODUCT_COLLECTION_program_program_roles_member | null;
}

export interface SEARCH_PRODUCT_COLLECTION_program_program_enrollments {
  __typename: "program_enrollment";
  member_id: string | null;
}

export interface SEARCH_PRODUCT_COLLECTION_program {
  __typename: "program";
  id: any;
  cover_url: string | null;
  title: string;
  abstract: string | null;
  published_at: any | null;
  is_subscription: boolean;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  /**
   * An array relationship
   */
  program_content_sections: SEARCH_PRODUCT_COLLECTION_program_program_content_sections[];
  /**
   * An array relationship
   */
  program_plans: SEARCH_PRODUCT_COLLECTION_program_program_plans[];
  /**
   * An array relationship
   */
  program_roles: SEARCH_PRODUCT_COLLECTION_program_program_roles[];
  /**
   * An array relationship
   */
  program_enrollments: SEARCH_PRODUCT_COLLECTION_program_program_enrollments[];
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_categories {
  __typename: "activity_category";
  id: any;
  /**
   * An object relationship
   */
  category: SEARCH_PRODUCT_COLLECTION_activity_activity_categories_category;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_enrollments_aggregate_aggregate {
  __typename: "activity_enrollment_aggregate_fields";
  count: number | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_enrollments_aggregate {
  __typename: "activity_enrollment_aggregate";
  aggregate: SEARCH_PRODUCT_COLLECTION_activity_activity_enrollments_aggregate_aggregate | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate_aggregate_min {
  __typename: "activity_session_min_fields";
  started_at: any | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate_aggregate_max {
  __typename: "activity_session_max_fields";
  ended_at: any | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate_aggregate {
  __typename: "activity_session_aggregate_fields";
  min: SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate_aggregate_min | null;
  max: SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate_aggregate_max | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate {
  __typename: "activity_session_aggregate";
  aggregate: SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate_aggregate | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate_nodes {
  __typename: "activity_ticket";
  id: any;
  /**
   * unlimited as 99999999
   */
  count: number;
  description: string | null;
  started_at: any;
  is_published: boolean;
  ended_at: any;
  price: any;
  title: string;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate_aggregate_sum {
  __typename: "activity_ticket_sum_fields";
  count: number | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate_aggregate {
  __typename: "activity_ticket_aggregate_fields";
  sum: SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate_aggregate_sum | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate {
  __typename: "activity_ticket_aggregate";
  nodes: SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate_nodes[];
  aggregate: SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate_aggregate | null;
}

export interface SEARCH_PRODUCT_COLLECTION_activity {
  __typename: "activity";
  id: any;
  cover_url: string | null;
  title: string;
  published_at: any | null;
  is_participants_visible: boolean;
  organizer_id: string;
  support_locales: any | null;
  /**
   * An array relationship
   */
  activity_categories: SEARCH_PRODUCT_COLLECTION_activity_activity_categories[];
  /**
   * An aggregated array relationship
   */
  activity_enrollments_aggregate: SEARCH_PRODUCT_COLLECTION_activity_activity_enrollments_aggregate;
  /**
   * An aggregated array relationship
   */
  activity_sessions_aggregate: SEARCH_PRODUCT_COLLECTION_activity_activity_sessions_aggregate;
  /**
   * An aggregated array relationship
   */
  activity_tickets_aggregate: SEARCH_PRODUCT_COLLECTION_activity_activity_tickets_aggregate;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_roles_member {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  username: string | null;
  name: string | null;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_roles {
  __typename: "podcast_program_role";
  id: any;
  /**
   * An object relationship
   */
  member: SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_roles_member | null;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_categories {
  __typename: "podcast_program_category";
  id: any;
  /**
   * An object relationship
   */
  category: SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_categories_category;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_enrollments {
  __typename: "podcast_program_enrollment";
  member_id: string | null;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_program {
  __typename: "podcast_program";
  id: any;
  cover_url: string | null;
  title: string;
  abstract: string | null;
  duration: any;
  duration_second: any;
  published_at: any | null;
  list_price: any;
  sale_price: any | null;
  sold_at: any | null;
  /**
   * An array relationship
   */
  podcast_program_roles: SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_roles[];
  /**
   * An array relationship
   */
  podcast_program_categories: SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_categories[];
  /**
   * An array relationship
   */
  podcast_program_enrollments: SEARCH_PRODUCT_COLLECTION_podcast_program_podcast_program_enrollments[];
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_plan_enrollment_podcast_plan {
  __typename: "podcast_plan";
  id: any;
  creator_id: string;
}

export interface SEARCH_PRODUCT_COLLECTION_podcast_plan_enrollment {
  __typename: "podcast_plan_enrollment";
  podcast_plan_id: any | null;
  /**
   * An object relationship
   */
  podcast_plan: SEARCH_PRODUCT_COLLECTION_podcast_plan_enrollment_podcast_plan | null;
}

export interface SEARCH_PRODUCT_COLLECTION_member_public {
  __typename: "member_public";
  id: string | null;
  picture_url: string | null;
  name: string | null;
  username: string | null;
  abstract: string | null;
}

export interface SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_tags {
  __typename: "merchandise_tag";
  tag_name: string;
}

export interface SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_categories {
  __typename: "merchandise_category";
  id: any;
  /**
   * An object relationship
   */
  category: SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_categories_category;
}

export interface SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
}

export interface SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_specs {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
}

export interface SEARCH_PRODUCT_COLLECTION_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  /**
   * An array relationship
   */
  merchandise_tags: SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_tags[];
  /**
   * An array relationship
   */
  merchandise_categories: SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_categories[];
  /**
   * An array relationship
   */
  merchandise_imgs: SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_imgs[];
  /**
   * An array relationship
   */
  merchandise_specs: SEARCH_PRODUCT_COLLECTION_merchandise_merchandise_specs[];
}

export interface SEARCH_PRODUCT_COLLECTION_project_project_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface SEARCH_PRODUCT_COLLECTION_project_project_categories {
  __typename: "project_category";
  id: any;
  /**
   * An object relationship
   */
  category: SEARCH_PRODUCT_COLLECTION_project_project_categories_category;
}

export interface SEARCH_PRODUCT_COLLECTION_project_project_sales {
  __typename: "project_sales";
  total_sales: any | null;
}

export interface SEARCH_PRODUCT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate_aggregate {
  __typename: "project_plan_enrollment_aggregate_fields";
  count: number | null;
}

export interface SEARCH_PRODUCT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate {
  __typename: "project_plan_enrollment_aggregate";
  aggregate: SEARCH_PRODUCT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate_aggregate | null;
}

export interface SEARCH_PRODUCT_COLLECTION_project_project_plans {
  __typename: "project_plan";
  id: any;
  cover_url: string | null;
  title: string;
  description: string | null;
  is_subscription: boolean;
  period_amount: any | null;
  /**
   * Y / M / W / D
   */
  period_type: string | null;
  list_price: any | null;
  sale_price: any | null;
  sold_at: any | null;
  discount_down_price: any;
  created_at: any;
  is_participants_visible: boolean;
  is_physical: boolean;
  is_limited: boolean;
  /**
   * An aggregated array relationship
   */
  project_plan_enrollments_aggregate: SEARCH_PRODUCT_COLLECTION_project_project_plans_project_plan_enrollments_aggregate;
}

export interface SEARCH_PRODUCT_COLLECTION_project {
  __typename: "project";
  id: any;
  /**
   * funding / pre-order / on-sale / modular
   */
  type: string;
  title: string;
  /**
   * image / video
   */
  cover_type: string;
  cover_url: string | null;
  preview_url: string | null;
  abstract: string | null;
  introduction: string | null;
  description: string | null;
  /**
   * funds / participants
   */
  target_unit: string;
  target_amount: any | null;
  expired_at: any | null;
  is_participants_visible: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An array relationship
   */
  project_categories: SEARCH_PRODUCT_COLLECTION_project_project_categories[];
  /**
   * An object relationship
   */
  project_sales: SEARCH_PRODUCT_COLLECTION_project_project_sales | null;
  /**
   * An array relationship
   */
  project_plans: SEARCH_PRODUCT_COLLECTION_project_project_plans[];
}

export interface SEARCH_PRODUCT_COLLECTION {
  /**
   * fetch data from the table: "program"
   */
  program: SEARCH_PRODUCT_COLLECTION_program[];
  /**
   * fetch data from the table: "activity"
   */
  activity: SEARCH_PRODUCT_COLLECTION_activity[];
  /**
   * fetch data from the table: "podcast_program"
   */
  podcast_program: SEARCH_PRODUCT_COLLECTION_podcast_program[];
  /**
   * fetch data from the table: "podcast_plan_enrollment"
   */
  podcast_plan_enrollment: SEARCH_PRODUCT_COLLECTION_podcast_plan_enrollment[];
  /**
   * fetch data from the table: "member_public"
   */
  member_public: SEARCH_PRODUCT_COLLECTION_member_public[];
  /**
   * fetch data from the table: "merchandise"
   */
  merchandise: SEARCH_PRODUCT_COLLECTION_merchandise[];
  /**
   * fetch data from the table: "project"
   */
  project: SEARCH_PRODUCT_COLLECTION_project[];
}

export interface SEARCH_PRODUCT_COLLECTIONVariables {
  memberId?: string | null;
  title?: string | null;
  tag?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostParts
// ====================================================

export interface PostParts_post_roles_member {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  picture_url: string | null;
  abstract: string | null;
}

export interface PostParts_post_roles {
  __typename: "post_role";
  id: any;
  /**
   * An object relationship
   */
  member: PostParts_post_roles_member | null;
}

export interface PostParts_post_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface PostParts_post_categories {
  __typename: "post_category";
  id: any;
  /**
   * An object relationship
   */
  category: PostParts_post_categories_category;
}

export interface PostParts_post_tags {
  __typename: "post_tag";
  id: any;
  tag_name: string;
}

export interface PostParts_post_merchandises_merchandise_merchandise_tags {
  __typename: "merchandise_tag";
  tag_name: string;
}

export interface PostParts_post_merchandises_merchandise_merchandise_categories_category {
  __typename: "category";
  id: string;
  name: string;
}

export interface PostParts_post_merchandises_merchandise_merchandise_categories {
  __typename: "merchandise_category";
  id: any;
  /**
   * An object relationship
   */
  category: PostParts_post_merchandises_merchandise_merchandise_categories_category;
}

export interface PostParts_post_merchandises_merchandise_merchandise_imgs {
  __typename: "merchandise_img";
  id: any;
  url: string;
  /**
   * cover | common
   */
  type: string;
}

export interface PostParts_post_merchandises_merchandise_member_shop {
  __typename: "member_shop";
  id: any;
  title: string;
  shipping_methods: any | null;
}

export interface PostParts_post_merchandises_merchandise_merchandise_specs_merchandise_spec_inventory_status {
  __typename: "merchandise_spec_inventory_status";
  buyable_quantity: any | null;
}

export interface PostParts_post_merchandises_merchandise_merchandise_specs {
  __typename: "merchandise_spec";
  id: any;
  title: string;
  list_price: any;
  sale_price: any | null;
  quota: number;
  /**
   * An object relationship
   */
  merchandise_spec_inventory_status: PostParts_post_merchandises_merchandise_merchandise_specs_merchandise_spec_inventory_status | null;
}

export interface PostParts_post_merchandises_merchandise {
  __typename: "merchandise";
  id: any;
  title: string;
  sold_at: any | null;
  abstract: string | null;
  description: string | null;
  started_at: any | null;
  ended_at: any | null;
  is_limited: boolean;
  is_physical: boolean;
  is_customized: boolean;
  is_countdown_timer_visible: boolean;
  /**
   * An array relationship
   */
  merchandise_tags: PostParts_post_merchandises_merchandise_merchandise_tags[];
  /**
   * An array relationship
   */
  merchandise_categories: PostParts_post_merchandises_merchandise_merchandise_categories[];
  /**
   * An array relationship
   */
  merchandise_imgs: PostParts_post_merchandises_merchandise_merchandise_imgs[];
  /**
   * An object relationship
   */
  member_shop: PostParts_post_merchandises_merchandise_member_shop | null;
  /**
   * An array relationship
   */
  merchandise_specs: PostParts_post_merchandises_merchandise_merchandise_specs[];
}

export interface PostParts_post_merchandises {
  __typename: "post_merchandise";
  id: any;
  /**
   * An object relationship
   */
  merchandise: PostParts_post_merchandises_merchandise;
}

export interface PostParts {
  __typename: "post";
  id: any;
  code_name: string | null;
  title: string;
  description: string | null;
  cover_url: string | null;
  video_url: string | null;
  abstract: string | null;
  views: number;
  published_at: any | null;
  /**
   * An array relationship
   */
  post_roles: PostParts_post_roles[];
  /**
   * An array relationship
   */
  post_categories: PostParts_post_categories[];
  /**
   * An array relationship
   */
  post_tags: PostParts_post_tags[];
  /**
   * An array relationship
   */
  post_merchandises: PostParts_post_merchandises[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: instructorField
// ====================================================

export interface instructorField {
  __typename: "member_public";
  id: string | null;
  name: string | null;
  abstract: string | null;
  picture_url: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * unique or primary key constraints on table "activity_attendance"
 */
export enum activity_attendance_constraint {
  activity_attendance_order_product_id_activity_session_id_key = "activity_attendance_order_product_id_activity_session_id_key",
  activity_attendance_pkey = "activity_attendance_pkey",
}

/**
 * update columns of table "activity_attendance"
 */
export enum activity_attendance_update_column {
  activity_session_id = "activity_session_id",
  created_at = "created_at",
  id = "id",
  order_product_id = "order_product_id",
}

/**
 * unique or primary key constraints on table "activity_category"
 */
export enum activity_category_constraint {
  activity_category_pkey = "activity_category_pkey",
}

/**
 * update columns of table "activity_category"
 */
export enum activity_category_update_column {
  activity_id = "activity_id",
  category_id = "category_id",
  id = "id",
  position = "position",
}

/**
 * unique or primary key constraints on table "activity"
 */
export enum activity_constraint {
  activity_pkey = "activity_pkey",
}

/**
 * unique or primary key constraints on table "activity_session"
 */
export enum activity_session_constraint {
  activity_session_pkey = "activity_session_pkey",
}

/**
 * unique or primary key constraints on table "activity_session_ticket"
 */
export enum activity_session_ticket_constraint {
  activity_session_ticket_activity_session_id_activity_ticket_id_ = "activity_session_ticket_activity_session_id_activity_ticket_id_",
  activity_session_ticket_pkey = "activity_session_ticket_pkey",
}

/**
 * update columns of table "activity_session_ticket"
 */
export enum activity_session_ticket_update_column {
  activity_session_id = "activity_session_id",
  activity_session_type = "activity_session_type",
  activity_ticket_id = "activity_ticket_id",
  id = "id",
}

/**
 * update columns of table "activity_session"
 */
export enum activity_session_update_column {
  activity_id = "activity_id",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  location = "location",
  location_online = "location_online",
  started_at = "started_at",
  threshold = "threshold",
  title = "title",
}

/**
 * unique or primary key constraints on table "activity_tag"
 */
export enum activity_tag_constraint {
  activity_tag_pkey = "activity_tag_pkey",
}

/**
 * update columns of table "activity_tag"
 */
export enum activity_tag_update_column {
  activity_id = "activity_id",
  id = "id",
  position = "position",
  tag_name = "tag_name",
}

/**
 * unique or primary key constraints on table "activity_ticket"
 */
export enum activity_ticket_constraint {
  activity_ticket_pkey = "activity_ticket_pkey",
}

/**
 * update columns of table "activity_ticket"
 */
export enum activity_ticket_update_column {
  activity_id = "activity_id",
  count = "count",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  is_published = "is_published",
  price = "price",
  started_at = "started_at",
  title = "title",
}

/**
 * update columns of table "activity"
 */
export enum activity_update_column {
  app_id = "app_id",
  cover_url = "cover_url",
  description = "description",
  id = "id",
  is_participants_visible = "is_participants_visible",
  organizer_id = "organizer_id",
  position = "position",
  published_at = "published_at",
  support_locales = "support_locales",
  title = "title",
}

/**
 * unique or primary key constraints on table "app_admin"
 */
export enum app_admin_constraint {
  app_admin_pkey = "app_admin_pkey",
}

/**
 * update columns of table "app_admin"
 */
export enum app_admin_update_column {
  api_host = "api_host",
  app_id = "app_id",
  host = "host",
  position = "position",
}

/**
 * unique or primary key constraints on table "app"
 */
export enum app_constraint {
  App_pkey = "App_pkey",
}

/**
 * unique or primary key constraints on table "app_module"
 */
export enum app_module_constraint {
  app_module_app_id_module_id_key = "app_module_app_id_module_id_key",
  app_module_pkey = "app_module_pkey",
}

/**
 * update columns of table "app_module"
 */
export enum app_module_update_column {
  app_id = "app_id",
  created_at = "created_at",
  id = "id",
  module_id = "module_id",
}

/**
 * unique or primary key constraints on table "app_nav"
 */
export enum app_nav_constraint {
  app_nav_pkey = "app_nav_pkey",
}

/**
 * update columns of table "app_nav"
 */
export enum app_nav_update_column {
  app_id = "app_id",
  block = "block",
  external = "external",
  href = "href",
  icon = "icon",
  id = "id",
  label = "label",
  locale = "locale",
  position = "position",
  tag = "tag",
}

/**
 * unique or primary key constraints on table "app_secret"
 */
export enum app_secret_constraint {
  app_secret_app_id_key_key = "app_secret_app_id_key_key",
  app_secret_pkey = "app_secret_pkey",
}

/**
 * update columns of table "app_secret"
 */
export enum app_secret_update_column {
  app_id = "app_id",
  id = "id",
  key = "key",
  value = "value",
}

/**
 * unique or primary key constraints on table "app_setting"
 */
export enum app_setting_constraint {
  app_setting_app_id_key_key = "app_setting_app_id_key_key",
  app_setting_pkey = "app_setting_pkey",
}

/**
 * update columns of table "app_setting"
 */
export enum app_setting_update_column {
  app_id = "app_id",
  id = "id",
  key = "key",
  value = "value",
}

/**
 * update columns of table "app"
 */
export enum app_update_column {
  description = "description",
  id = "id",
  name = "name",
  point_discount_ratio = "point_discount_ratio",
  point_exchange_rate = "point_exchange_rate",
  point_validity_period = "point_validity_period",
  title = "title",
  vimeo_project_id = "vimeo_project_id",
}

/**
 * unique or primary key constraints on table "appointment_plan"
 */
export enum appointment_plan_constraint {
  appointment_plan_pkey = "appointment_plan_pkey",
}

/**
 * update columns of table "appointment_plan"
 */
export enum appointment_plan_update_column {
  created_at = "created_at",
  creator_id = "creator_id",
  currency_id = "currency_id",
  description = "description",
  duration = "duration",
  id = "id",
  is_private = "is_private",
  phone = "phone",
  price = "price",
  published_at = "published_at",
  reservation_amount = "reservation_amount",
  reservation_type = "reservation_type",
  support_locales = "support_locales",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "appointment_schedule"
 */
export enum appointment_schedule_constraint {
  appointment_schedule_pkey = "appointment_schedule_pkey",
}

/**
 * update columns of table "appointment_schedule"
 */
export enum appointment_schedule_update_column {
  appointment_plan_id = "appointment_plan_id",
  created_at = "created_at",
  excludes = "excludes",
  id = "id",
  interval_amount = "interval_amount",
  interval_type = "interval_type",
  started_at = "started_at",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "attachment"
 */
export enum attachment_constraint {
  attachment_pkey = "attachment_pkey",
}

/**
 * update columns of table "attachment"
 */
export enum attachment_update_column {
  app_id = "app_id",
  created_at = "created_at",
  data = "data",
  id = "id",
  is_deleted = "is_deleted",
  options = "options",
  target = "target",
  type = "type",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "attend"
 */
export enum attend_constraint {
  attend_pkey = "attend_pkey",
}

/**
 * update columns of table "attend"
 */
export enum attend_update_column {
  created_at = "created_at",
  ended_at = "ended_at",
  id = "id",
  member_id = "member_id",
  started_at = "started_at",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "card"
 */
export enum card_constraint {
  card_pkey = "card_pkey",
}

/**
 * unique or primary key constraints on table "card_discount"
 */
export enum card_discount_constraint {
  card_discount_card_id_product_id_key = "card_discount_card_id_product_id_key",
  card_discount_pkey = "card_discount_pkey",
}

/**
 * update columns of table "card_discount"
 */
export enum card_discount_update_column {
  amount = "amount",
  card_id = "card_id",
  id = "id",
  product_id = "product_id",
  type = "type",
}

/**
 * update columns of table "card"
 */
export enum card_update_column {
  app_id = "app_id",
  creator_id = "creator_id",
  description = "description",
  id = "id",
  template = "template",
  title = "title",
}

/**
 * unique or primary key constraints on table "cart_item"
 */
export enum cart_item_constraint {
  cart_item_pkey = "cart_item_pkey",
}

/**
 * update columns of table "cart_item"
 */
export enum cart_item_update_column {
  app_id = "app_id",
  class = "class",
  fingerprint = "fingerprint",
  id = "id",
  target = "target",
}

/**
 * unique or primary key constraints on table "cart_product"
 */
export enum cart_product_constraint {
  cart_product_pkey = "cart_product_pkey",
}

/**
 * update columns of table "cart_product"
 */
export enum cart_product_update_column {
  app_id = "app_id",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  product_id = "product_id",
}

/**
 * unique or primary key constraints on table "category"
 */
export enum category_constraint {
  category_app_id_class_name_key = "category_app_id_class_name_key",
  category_id_key = "category_id_key",
  category_pkey = "category_pkey",
}

/**
 * update columns of table "category"
 */
export enum category_update_column {
  app_id = "app_id",
  class = "class",
  id = "id",
  name = "name",
  position = "position",
}

/**
 * unique or primary key constraints on table "coin_log"
 */
export enum coin_log_constraint {
  coin_log_pkey = "coin_log_pkey",
}

/**
 * update columns of table "coin_log"
 */
export enum coin_log_update_column {
  amount = "amount",
  created_at = "created_at",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  member_id = "member_id",
  note = "note",
  started_at = "started_at",
  title = "title",
}

/**
 * unique or primary key constraints on table "comment"
 */
export enum comment_constraint {
  comment_pkey = "comment_pkey",
}

/**
 * unique or primary key constraints on table "comment_reaction"
 */
export enum comment_reaction_constraint {
  comment_reaction_pkey = "comment_reaction_pkey",
}

/**
 * update columns of table "comment_reaction"
 */
export enum comment_reaction_update_column {
  comment_id = "comment_id",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
}

/**
 * unique or primary key constraints on table "comment_reply"
 */
export enum comment_reply_constraint {
  comment_reply_pkey = "comment_reply_pkey",
}

/**
 * unique or primary key constraints on table "comment_reply_reaction"
 */
export enum comment_reply_reaction_constraint {
  comment_reply_reaction_pkey = "comment_reply_reaction_pkey",
}

/**
 * update columns of table "comment_reply_reaction"
 */
export enum comment_reply_reaction_update_column {
  comment_reply_id = "comment_reply_id",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
}

/**
 * update columns of table "comment_reply"
 */
export enum comment_reply_update_column {
  comment_id = "comment_id",
  content = "content",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
}

/**
 * update columns of table "comment"
 */
export enum comment_update_column {
  app_id = "app_id",
  content = "content",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  thread_id = "thread_id",
}

/**
 * unique or primary key constraints on table "contract"
 */
export enum contract_constraint {
  contract_pkey = "contract_pkey",
}

/**
 * update columns of table "contract"
 */
export enum contract_update_column {
  app_id = "app_id",
  created_at = "created_at",
  deliverables = "deliverables",
  description = "description",
  id = "id",
  name = "name",
  options = "options",
  published_at = "published_at",
  revocation = "revocation",
  template = "template",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "coupon_code"
 */
export enum coupon_code_constraint {
  coupon_code_code_key = "coupon_code_code_key",
  coupon_plan_code_app_id_code_key = "coupon_plan_code_app_id_code_key",
  coupon_plan_code_pkey = "coupon_plan_code_pkey",
}

/**
 * update columns of table "coupon_code"
 */
export enum coupon_code_update_column {
  app_id = "app_id",
  code = "code",
  count = "count",
  coupon_plan_id = "coupon_plan_id",
  id = "id",
  remaining = "remaining",
}

/**
 * unique or primary key constraints on table "coupon"
 */
export enum coupon_constraint {
  coupon_member_id_coupon_code_id_key = "coupon_member_id_coupon_code_id_key",
  coupon_pkey = "coupon_pkey",
}

/**
 * unique or primary key constraints on table "coupon_plan"
 */
export enum coupon_plan_constraint {
  coupon_plan_pkey = "coupon_plan_pkey",
}

/**
 * unique or primary key constraints on table "coupon_plan_product"
 */
export enum coupon_plan_product_constraint {
  coupon_plan_product_pkey = "coupon_plan_product_pkey",
}

/**
 * update columns of table "coupon_plan_product"
 */
export enum coupon_plan_product_update_column {
  coupon_plan_id = "coupon_plan_id",
  id = "id",
  product_id = "product_id",
}

/**
 * update columns of table "coupon_plan"
 */
export enum coupon_plan_update_column {
  amount = "amount",
  constraint = "constraint",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  scope = "scope",
  started_at = "started_at",
  title = "title",
  type = "type",
  updated_at = "updated_at",
}

/**
 * update columns of table "coupon"
 */
export enum coupon_update_column {
  coupon_code_id = "coupon_code_id",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
}

/**
 * unique or primary key constraints on table "creator_category"
 */
export enum creator_category_constraint {
  creator_category_pkey = "creator_category_pkey",
}

/**
 * update columns of table "creator_category"
 */
export enum creator_category_update_column {
  category_id = "category_id",
  creator_id = "creator_id",
  id = "id",
  position = "position",
}

/**
 * unique or primary key constraints on table "creator_display"
 */
export enum creator_display_constraint {
  creator_display_member_id_block_id_key = "creator_display_member_id_block_id_key",
  creator_display_pkey = "creator_display_pkey",
}

/**
 * update columns of table "creator_display"
 */
export enum creator_display_update_column {
  block_id = "block_id",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  position = "position",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "currency"
 */
export enum currency_constraint {
  currency_pkey = "currency_pkey",
}

/**
 * update columns of table "currency"
 */
export enum currency_update_column {
  id = "id",
  label = "label",
  name = "name",
  unit = "unit",
}

/**
 * unique or primary key constraints on table "exercise"
 */
export enum exercise_constraint {
  exercise_pkey = "exercise_pkey",
}

/**
 * update columns of table "exercise"
 */
export enum exercise_update_column {
  answer = "answer",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  program_content_id = "program_content_id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "issue"
 */
export enum issue_constraint {
  issue_pkey = "issue_pkey",
}

/**
 * unique or primary key constraints on table "issue_reaction"
 */
export enum issue_reaction_constraint {
  issue_reaction_issue_id_member_id_key = "issue_reaction_issue_id_member_id_key",
  issue_reaction_pkey = "issue_reaction_pkey",
}

/**
 * update columns of table "issue_reaction"
 */
export enum issue_reaction_update_column {
  created_at = "created_at",
  id = "id",
  issue_id = "issue_id",
  member_id = "member_id",
}

/**
 * unique or primary key constraints on table "issue_reply"
 */
export enum issue_reply_constraint {
  issue_reply_pkey = "issue_reply_pkey",
}

/**
 * unique or primary key constraints on table "issue_reply_reaction"
 */
export enum issue_reply_reaction_constraint {
  issue_reply_reaction_pkey = "issue_reply_reaction_pkey",
}

/**
 * update columns of table "issue_reply_reaction"
 */
export enum issue_reply_reaction_update_column {
  created_at = "created_at",
  id = "id",
  issue_reply_id = "issue_reply_id",
  member_id = "member_id",
}

/**
 * update columns of table "issue_reply"
 */
export enum issue_reply_update_column {
  content = "content",
  created_at = "created_at",
  id = "id",
  issue_id = "issue_id",
  member_id = "member_id",
}

/**
 * update columns of table "issue"
 */
export enum issue_update_column {
  app_id = "app_id",
  created_at = "created_at",
  description = "description",
  id = "id",
  member_id = "member_id",
  solved_at = "solved_at",
  thread_id = "thread_id",
  title = "title",
}

/**
 * unique or primary key constraints on table "media"
 */
export enum media_constraint {
  media_pkey = "media_pkey",
}

/**
 * update columns of table "media"
 */
export enum media_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  metadata = "metadata",
  name = "name",
  resource_url = "resource_url",
  size = "size",
  type = "type",
}

/**
 * unique or primary key constraints on table "member_card"
 */
export enum member_card_constraint {
  member_card_id_key = "member_card_id_key",
  member_card_member_id_card_identifier_key = "member_card_member_id_card_identifier_key",
  member_card_pkey = "member_card_pkey",
}

/**
 * update columns of table "member_card"
 */
export enum member_card_update_column {
  card_holder = "card_holder",
  card_identifier = "card_identifier",
  card_info = "card_info",
  card_secret = "card_secret",
  id = "id",
  member_id = "member_id",
}

/**
 * unique or primary key constraints on table "member_category"
 */
export enum member_category_constraint {
  member_category_member_id_category_id_key = "member_category_member_id_category_id_key",
  member_category_pkey = "member_category_pkey",
}

/**
 * update columns of table "member_category"
 */
export enum member_category_update_column {
  category_id = "category_id",
  id = "id",
  member_id = "member_id",
  position = "position",
}

/**
 * unique or primary key constraints on table "member"
 */
export enum member_constraint {
  User_pkey = "User_pkey",
  member_app_id_email_key = "member_app_id_email_key",
  member_app_id_username_key = "member_app_id_username_key",
  member_line_user_id_app_id_key = "member_line_user_id_app_id_key",
  member_refresh_token_key = "member_refresh_token_key",
  member_zoom_user_id_key = "member_zoom_user_id_key",
}

/**
 * unique or primary key constraints on table "member_contract"
 */
export enum member_contract_constraint {
  member_contract_pkey = "member_contract_pkey",
}

/**
 * update columns of table "member_contract"
 */
export enum member_contract_update_column {
  agreed_at = "agreed_at",
  agreed_ip = "agreed_ip",
  agreed_options = "agreed_options",
  author_id = "author_id",
  contract_id = "contract_id",
  created_at = "created_at",
  ended_at = "ended_at",
  id = "id",
  member_id = "member_id",
  options = "options",
  revocation_values = "revocation_values",
  revoked_at = "revoked_at",
  started_at = "started_at",
  updated_at = "updated_at",
  values = "values",
}

/**
 * unique or primary key constraints on table "member_note"
 */
export enum member_note_constraint {
  member_note_pkey = "member_note_pkey",
}

/**
 * update columns of table "member_note"
 */
export enum member_note_update_column {
  author_id = "author_id",
  created_at = "created_at",
  description = "description",
  duration = "duration",
  id = "id",
  member_id = "member_id",
  metadata = "metadata",
  note = "note",
  rejected_at = "rejected_at",
  status = "status",
  type = "type",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "member_permission_extra"
 */
export enum member_permission_extra_constraint {
  member_permission_pkey = "member_permission_pkey",
}

/**
 * update columns of table "member_permission_extra"
 */
export enum member_permission_extra_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  permission_id = "permission_id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "member_phone"
 */
export enum member_phone_constraint {
  member_phone_member_id_phone_key = "member_phone_member_id_phone_key",
  member_phone_pkey = "member_phone_pkey",
}

/**
 * update columns of table "member_phone"
 */
export enum member_phone_update_column {
  created_at = "created_at",
  id = "id",
  is_primary = "is_primary",
  is_valid = "is_valid",
  member_id = "member_id",
  phone = "phone",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "member_property"
 */
export enum member_property_constraint {
  member_property_member_id_property_id_key = "member_property_member_id_property_id_key",
  member_property_pkey = "member_property_pkey",
}

/**
 * update columns of table "member_property"
 */
export enum member_property_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  property_id = "property_id",
  updated_at = "updated_at",
  value = "value",
}

/**
 * unique or primary key constraints on table "member_shop"
 */
export enum member_shop_constraint {
  member_shop_pkey = "member_shop_pkey",
}

/**
 * update columns of table "member_shop"
 */
export enum member_shop_update_column {
  cover_url = "cover_url",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  published_at = "published_at",
  shipping_methods = "shipping_methods",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "member_social"
 */
export enum member_social_constraint {
  member_social_pkey = "member_social_pkey",
  member_social_type_channel_id_key = "member_social_type_channel_id_key",
}

/**
 * update columns of table "member_social"
 */
export enum member_social_update_column {
  channel_id = "channel_id",
  channel_url = "channel_url",
  description = "description",
  id = "id",
  member_id = "member_id",
  name = "name",
  profile_url = "profile_url",
  type = "type",
}

/**
 * unique or primary key constraints on table "member_speciality"
 */
export enum member_speciality_constraint {
  member_speciality_pkey = "member_speciality_pkey",
}

/**
 * update columns of table "member_speciality"
 */
export enum member_speciality_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  tag_name = "tag_name",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "member_tag"
 */
export enum member_tag_constraint {
  member_tag_member_id_tag_name_key = "member_tag_member_id_tag_name_key",
  member_tag_pkey = "member_tag_pkey",
}

/**
 * update columns of table "member_tag"
 */
export enum member_tag_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  tag_name = "tag_name",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "member_task"
 */
export enum member_task_constraint {
  member_task_pkey = "member_task_pkey",
}

/**
 * update columns of table "member_task"
 */
export enum member_task_update_column {
  author_id = "author_id",
  category_id = "category_id",
  created_at = "created_at",
  description = "description",
  due_at = "due_at",
  executor_id = "executor_id",
  id = "id",
  member_id = "member_id",
  priority = "priority",
  status = "status",
  title = "title",
  updated_at = "updated_at",
}

/**
 * update columns of table "member"
 */
export enum member_update_column {
  abstract = "abstract",
  app_id = "app_id",
  assigned_at = "assigned_at",
  created_at = "created_at",
  description = "description",
  email = "email",
  facebook_user_id = "facebook_user_id",
  google_user_id = "google_user_id",
  id = "id",
  line_user_id = "line_user_id",
  logined_at = "logined_at",
  manager_id = "manager_id",
  metadata = "metadata",
  name = "name",
  passhash = "passhash",
  picture_url = "picture_url",
  refresh_token = "refresh_token",
  role = "role",
  roles_deprecated = "roles_deprecated",
  star = "star",
  title = "title",
  username = "username",
  youtube_channel_ids = "youtube_channel_ids",
  zoom_user_id_deprecate = "zoom_user_id_deprecate",
}

/**
 * unique or primary key constraints on table "merchandise_category"
 */
export enum merchandise_category_constraint {
  merchandise_category_pkey = "merchandise_category_pkey",
}

/**
 * update columns of table "merchandise_category"
 */
export enum merchandise_category_update_column {
  category_id = "category_id",
  id = "id",
  merchandise_id = "merchandise_id",
  position = "position",
}

/**
 * unique or primary key constraints on table "merchandise"
 */
export enum merchandise_constraint {
  merchandise_pkey = "merchandise_pkey",
}

/**
 * unique or primary key constraints on table "merchandise_file"
 */
export enum merchandise_file_constraint {
  merchandise_file_pkey = "merchandise_file_pkey",
}

/**
 * update columns of table "merchandise_file"
 */
export enum merchandise_file_update_column {
  created_at = "created_at",
  data = "data",
  id = "id",
  merchandise_id = "merchandise_id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "merchandise_img"
 */
export enum merchandise_img_constraint {
  merchandise_img_pkey = "merchandise_img_pkey",
}

/**
 * update columns of table "merchandise_img"
 */
export enum merchandise_img_update_column {
  id = "id",
  merchandise_id = "merchandise_id",
  position = "position",
  type = "type",
  url = "url",
}

/**
 * unique or primary key constraints on table "merchandise_spec"
 */
export enum merchandise_spec_constraint {
  merchandise_spec_pkey = "merchandise_spec_pkey",
}

/**
 * unique or primary key constraints on table "merchandise_spec_file"
 */
export enum merchandise_spec_file_constraint {
  merchandise_spec_file_pkey = "merchandise_spec_file_pkey",
}

/**
 * update columns of table "merchandise_spec_file"
 */
export enum merchandise_spec_file_update_column {
  created_at = "created_at",
  data = "data",
  id = "id",
  merchandise_spec_id = "merchandise_spec_id",
  updated_at = "updated_at",
}

/**
 * update columns of table "merchandise_spec"
 */
export enum merchandise_spec_update_column {
  created_at = "created_at",
  id = "id",
  is_deleted = "is_deleted",
  list_price = "list_price",
  merchandise_id = "merchandise_id",
  quota = "quota",
  sale_price = "sale_price",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "merchandise_tag"
 */
export enum merchandise_tag_constraint {
  merchandise_tag_pkey = "merchandise_tag_pkey",
}

/**
 * update columns of table "merchandise_tag"
 */
export enum merchandise_tag_update_column {
  id = "id",
  merchandise_id = "merchandise_id",
  position = "position",
  tag_name = "tag_name",
}

/**
 * update columns of table "merchandise"
 */
export enum merchandise_update_column {
  abstract = "abstract",
  app_id = "app_id",
  created_at = "created_at",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  is_countdown_timer_visible = "is_countdown_timer_visible",
  is_customized = "is_customized",
  is_deleted = "is_deleted",
  is_limited = "is_limited",
  is_physical = "is_physical",
  link = "link",
  list_price = "list_price",
  member_id = "member_id",
  member_shop_id = "member_shop_id",
  meta = "meta",
  position = "position",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  started_at = "started_at",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "module"
 */
export enum module_constraint {
  module_id_key = "module_id_key",
  module_pkey = "module_pkey",
}

/**
 * update columns of table "module"
 */
export enum module_update_column {
  id = "id",
  name = "name",
}

/**
 * unique or primary key constraints on table "notification"
 */
export enum notification_constraint {
  notification_pkey = "notification_pkey",
}

/**
 * update columns of table "notification"
 */
export enum notification_update_column {
  avatar = "avatar",
  created_at = "created_at",
  description = "description",
  extra = "extra",
  id = "id",
  read_at = "read_at",
  reference_url = "reference_url",
  source_member_id = "source_member_id",
  target_member_id = "target_member_id",
  type = "type",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "order_contact"
 */
export enum order_contact_constraint {
  order_contact_pkey = "order_contact_pkey",
}

/**
 * update columns of table "order_contact"
 */
export enum order_contact_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  message = "message",
  order_id = "order_id",
  read_at = "read_at",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "order_discount"
 */
export enum order_discount_constraint {
  order_discount_pkey = "order_discount_pkey",
}

/**
 * update columns of table "order_discount"
 */
export enum order_discount_update_column {
  description = "description",
  id = "id",
  name = "name",
  options = "options",
  order_id = "order_id",
  price = "price",
  target = "target",
  type = "type",
}

/**
 * unique or primary key constraints on table "order_executor"
 */
export enum order_executor_constraint {
  order_executor_pkey = "order_executor_pkey",
}

/**
 * update columns of table "order_executor"
 */
export enum order_executor_update_column {
  id = "id",
  member_id = "member_id",
  order_id = "order_id",
  ratio = "ratio",
}

/**
 * unique or primary key constraints on table "order_log"
 */
export enum order_log_constraint {
  order_log_id_key = "order_log_id_key",
  order_log_pkey = "order_log_pkey",
}

/**
 * update columns of table "order_log"
 */
export enum order_log_update_column {
  auto_renewed_at = "auto_renewed_at",
  created_at = "created_at",
  deliver_message = "deliver_message",
  delivered_at = "delivered_at",
  discount_coupon_id = "discount_coupon_id",
  discount_point = "discount_point",
  discount_price = "discount_price",
  discount_type = "discount_type",
  expired_at = "expired_at",
  id = "id",
  invoice = "invoice",
  is_deleted = "is_deleted",
  last_paid_at = "last_paid_at",
  member_id = "member_id",
  message = "message",
  options = "options",
  parent_order_id = "parent_order_id",
  payment_model = "payment_model",
  retried_at = "retried_at",
  shipping = "shipping",
  status = "status",
  transferred_at = "transferred_at",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "order_product"
 */
export enum order_product_constraint {
  order_product_order_id_product_id_key = "order_product_order_id_product_id_key",
  order_product_pkey = "order_product_pkey",
}

/**
 * unique or primary key constraints on table "order_product_file"
 */
export enum order_product_file_constraint {
  order_product_file_pkey = "order_product_file_pkey",
}

/**
 * update columns of table "order_product_file"
 */
export enum order_product_file_update_column {
  created_at = "created_at",
  data = "data",
  id = "id",
  order_product_id = "order_product_id",
  updated_at = "updated_at",
}

/**
 * update columns of table "order_product"
 */
export enum order_product_update_column {
  accumulated_errors = "accumulated_errors",
  auto_renewed = "auto_renewed",
  created_at = "created_at",
  currency_id = "currency_id",
  deliverables = "deliverables",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  name = "name",
  options = "options",
  order_id = "order_id",
  price = "price",
  product_id = "product_id",
  started_at = "started_at",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "package"
 */
export enum package_constraint {
  package_pkey = "package_pkey",
}

/**
 * unique or primary key constraints on table "package_item"
 */
export enum package_item_constraint {
  package_item_pkey = "package_item_pkey",
}

/**
 * unique or primary key constraints on table "package_item_group"
 */
export enum package_item_group_constraint {
  package_item_group_pkey = "package_item_group_pkey",
}

/**
 * update columns of table "package_item_group"
 */
export enum package_item_group_update_column {
  id = "id",
  package_section_id = "package_section_id",
  subtitle = "subtitle",
  title = "title",
  type = "type",
  with_filter = "with_filter",
}

/**
 * update columns of table "package_item"
 */
export enum package_item_update_column {
  activity_id = "activity_id",
  id = "id",
  merchandise_id = "merchandise_id",
  package_item_group_id = "package_item_group_id",
  program_id = "program_id",
}

/**
 * unique or primary key constraints on table "package_section"
 */
export enum package_section_constraint {
  package_section_pkey = "package_section_pkey",
}

/**
 * update columns of table "package_section"
 */
export enum package_section_update_column {
  block = "block",
  description = "description",
  id = "id",
  package_id = "package_id",
  position = "position",
  subtitle = "subtitle",
  title = "title",
}

/**
 * update columns of table "package"
 */
export enum package_update_column {
  app_id = "app_id",
  elements = "elements",
  id = "id",
  title = "title",
}

/**
 * unique or primary key constraints on table "payment_log"
 */
export enum payment_log_constraint {
  payment_log_no_key = "payment_log_no_key",
  payment_log_pkey = "payment_log_pkey",
}

/**
 * update columns of table "payment_log"
 */
export enum payment_log_update_column {
  created_at = "created_at",
  gateway = "gateway",
  method = "method",
  no = "no",
  options = "options",
  order_id = "order_id",
  paid_at = "paid_at",
  payment_due_at = "payment_due_at",
  price = "price",
  status = "status",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "permission"
 */
export enum permission_constraint {
  permission_pkey = "permission_pkey",
}

/**
 * update columns of table "permission"
 */
export enum permission_update_column {
  created_at = "created_at",
  description = "description",
  group = "group",
  id = "id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "playlist"
 */
export enum playlist_constraint {
  playlist_pkey = "playlist_pkey",
}

/**
 * unique or primary key constraints on table "playlist_podcast_program"
 */
export enum playlist_podcast_program_constraint {
  playlist_podcast_program_pkey = "playlist_podcast_program_pkey",
}

/**
 * update columns of table "playlist_podcast_program"
 */
export enum playlist_podcast_program_update_column {
  created_at = "created_at",
  id = "id",
  playlist_id = "playlist_id",
  podcast_program_id = "podcast_program_id",
  position = "position",
  updated_at = "updated_at",
}

/**
 * update columns of table "playlist"
 */
export enum playlist_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  position = "position",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "podcast"
 */
export enum podcast_constraint {
  podcast_pkey = "podcast_pkey",
}

/**
 * unique or primary key constraints on table "podcast_plan"
 */
export enum podcast_plan_constraint {
  podcast_plan_pkey = "podcast_plan_pkey",
}

/**
 * update columns of table "podcast_plan"
 */
export enum podcast_plan_update_column {
  created_at = "created_at",
  creator_id = "creator_id",
  id = "id",
  is_subscription = "is_subscription",
  list_price = "list_price",
  period_amount = "period_amount",
  period_type = "period_type",
  podcast_id = "podcast_id",
  position = "position",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "podcast_program_audio"
 */
export enum podcast_program_audio_constraint {
  podcast_program_audio_pkey = "podcast_program_audio_pkey",
}

/**
 * update columns of table "podcast_program_audio"
 */
export enum podcast_program_audio_update_column {
  created_at = "created_at",
  data = "data",
  deleted_at = "deleted_at",
  id = "id",
  podcast_program_id = "podcast_program_id",
  position = "position",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "podcast_program_body"
 */
export enum podcast_program_body_constraint {
  podcast_program_body_pkey = "podcast_program_body_pkey",
}

/**
 * update columns of table "podcast_program_body"
 */
export enum podcast_program_body_update_column {
  data = "data",
  deleted_at = "deleted_at",
  description = "description",
  id = "id",
  podcast_program_id = "podcast_program_id",
  position = "position",
}

/**
 * unique or primary key constraints on table "podcast_program_category"
 */
export enum podcast_program_category_constraint {
  podcast_program_category_pkey = "podcast_program_category_pkey",
}

/**
 * update columns of table "podcast_program_category"
 */
export enum podcast_program_category_update_column {
  category_id = "category_id",
  id = "id",
  podcast_program_id = "podcast_program_id",
  position = "position",
}

/**
 * unique or primary key constraints on table "podcast_program"
 */
export enum podcast_program_constraint {
  podcast_program_pkey = "podcast_program_pkey",
}

/**
 * unique or primary key constraints on table "podcast_program_role"
 */
export enum podcast_program_role_constraint {
  podcast_program_role_pkey = "podcast_program_role_pkey",
}

/**
 * update columns of table "podcast_program_role"
 */
export enum podcast_program_role_update_column {
  id = "id",
  member_id = "member_id",
  name = "name",
  podcast_program_id = "podcast_program_id",
}

/**
 * unique or primary key constraints on table "podcast_program_tag"
 */
export enum podcast_program_tag_constraint {
  podcast_program_tag_pkey = "podcast_program_tag_pkey",
  podcast_program_tag_podcast_program_id_tag_name_key = "podcast_program_tag_podcast_program_id_tag_name_key",
}

/**
 * update columns of table "podcast_program_tag"
 */
export enum podcast_program_tag_update_column {
  id = "id",
  podcast_program_id = "podcast_program_id",
  position = "position",
  tag_name = "tag_name",
}

/**
 * update columns of table "podcast_program"
 */
export enum podcast_program_update_column {
  abstract = "abstract",
  content_type = "content_type",
  cover_url = "cover_url",
  creator_id = "creator_id",
  duration = "duration",
  duration_second = "duration_second",
  filename = "filename",
  id = "id",
  list_price = "list_price",
  podcast_id = "podcast_id",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  support_locales = "support_locales",
  title = "title",
  updated_at = "updated_at",
}

/**
 * update columns of table "podcast"
 */
export enum podcast_update_column {
  app_id = "app_id",
  id = "id",
  instructor_id = "instructor_id",
}

/**
 * unique or primary key constraints on table "point_log"
 */
export enum point_log_constraint {
  point_log_pkey = "point_log_pkey",
}

/**
 * update columns of table "point_log"
 */
export enum point_log_update_column {
  created_at = "created_at",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  member_id = "member_id",
  note = "note",
  point = "point",
  started_at = "started_at",
}

/**
 * unique or primary key constraints on table "post_category"
 */
export enum post_category_constraint {
  post_category_pkey = "post_category_pkey",
}

/**
 * update columns of table "post_category"
 */
export enum post_category_update_column {
  category_id = "category_id",
  id = "id",
  position = "position",
  post_id = "post_id",
}

/**
 * unique or primary key constraints on table "post"
 */
export enum post_constraint {
  post_pkey = "post_pkey",
}

/**
 * unique or primary key constraints on table "post_merchandise"
 */
export enum post_merchandise_constraint {
  post_merchandise_pkey = "post_merchandise_pkey",
}

/**
 * update columns of table "post_merchandise"
 */
export enum post_merchandise_update_column {
  id = "id",
  merchandise_id = "merchandise_id",
  position = "position",
  post_id = "post_id",
}

/**
 * unique or primary key constraints on table "post_role"
 */
export enum post_role_constraint {
  post_role_pkey = "post_role_pkey",
}

/**
 * update columns of table "post_role"
 */
export enum post_role_update_column {
  id = "id",
  member_id = "member_id",
  name = "name",
  position = "position",
  post_id = "post_id",
}

/**
 * unique or primary key constraints on table "post_tag"
 */
export enum post_tag_constraint {
  post_tag_pkey = "post_tag_pkey",
}

/**
 * update columns of table "post_tag"
 */
export enum post_tag_update_column {
  id = "id",
  position = "position",
  post_id = "post_id",
  tag_name = "tag_name",
}

/**
 * update columns of table "post"
 */
export enum post_update_column {
  abstract = "abstract",
  app_id = "app_id",
  code_name = "code_name",
  cover_url = "cover_url",
  created_at = "created_at",
  description = "description",
  id = "id",
  is_deleted = "is_deleted",
  position = "position",
  published_at = "published_at",
  title = "title",
  updated_at = "updated_at",
  video_url = "video_url",
  views = "views",
}

/**
 * unique or primary key constraints on table "practice"
 */
export enum practice_constraint {
  practice_pkey = "practice_pkey",
}

/**
 * unique or primary key constraints on table "practice_reaction"
 */
export enum practice_reaction_constraint {
  practice_reaction_pkey = "practice_reaction_pkey",
}

/**
 * update columns of table "practice_reaction"
 */
export enum practice_reaction_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  practice_id = "practice_id",
}

/**
 * update columns of table "practice"
 */
export enum practice_update_column {
  cover_url = "cover_url",
  created_at = "created_at",
  description = "description",
  id = "id",
  is_deleted = "is_deleted",
  member_id = "member_id",
  program_content_id = "program_content_id",
  reviewed_at = "reviewed_at",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "product"
 */
export enum product_constraint {
  product_id_key = "product_id_key",
  product_pkey = "product_pkey",
}

/**
 * unique or primary key constraints on table "product_inventory"
 */
export enum product_inventory_constraint {
  product_inventory_pkey = "product_inventory_pkey",
}

/**
 * update columns of table "product_inventory"
 */
export enum product_inventory_update_column {
  comment = "comment",
  created_at = "created_at",
  id = "id",
  product_id = "product_id",
  quantity = "quantity",
  specification = "specification",
  status = "status",
}

/**
 * update columns of table "product"
 */
export enum product_update_column {
  id = "id",
  target = "target",
  type = "type",
}

/**
 * unique or primary key constraints on table "program_announcement"
 */
export enum program_announcement_constraint {
  program_announcement_pkey = "program_announcement_pkey",
}

/**
 * update columns of table "program_announcement"
 */
export enum program_announcement_update_column {
  created_at = "created_at",
  description = "description",
  id = "id",
  program_id = "program_id",
  published_at = "published_at",
  title = "title",
}

/**
 * unique or primary key constraints on table "program_approval"
 */
export enum program_approval_constraint {
  program_approval_pkey = "program_approval_pkey",
}

/**
 * update columns of table "program_approval"
 */
export enum program_approval_update_column {
  created_at = "created_at",
  description = "description",
  feedback = "feedback",
  id = "id",
  program_id = "program_id",
  status = "status",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "program_category"
 */
export enum program_category_constraint {
  program_category_pkey = "program_category_pkey",
}

/**
 * update columns of table "program_category"
 */
export enum program_category_update_column {
  category_id = "category_id",
  id = "id",
  position = "position",
  program_id = "program_id",
}

/**
 * unique or primary key constraints on table "program"
 */
export enum program_constraint {
  program_pkey = "program_pkey",
}

/**
 * unique or primary key constraints on table "program_content_body"
 */
export enum program_content_body_constraint {
  program_content_body_pkey = "program_content_body_pkey",
}

/**
 * update columns of table "program_content_body"
 */
export enum program_content_body_update_column {
  data = "data",
  description = "description",
  id = "id",
  type = "type",
}

/**
 * unique or primary key constraints on table "program_content"
 */
export enum program_content_constraint {
  program_content_pkey = "program_content_pkey",
}

/**
 * unique or primary key constraints on table "program_content_material"
 */
export enum program_content_material_constraint {
  program_content_material_pkey = "program_content_material_pkey",
}

/**
 * update columns of table "program_content_material"
 */
export enum program_content_material_update_column {
  created_at = "created_at",
  data = "data",
  id = "id",
  program_content_id = "program_content_id",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "program_content_plan"
 */
export enum program_content_plan_constraint {
  program_content_permission_pkey = "program_content_permission_pkey",
}

/**
 * update columns of table "program_content_plan"
 */
export enum program_content_plan_update_column {
  id = "id",
  program_content_id = "program_content_id",
  program_plan_id = "program_plan_id",
}

/**
 * unique or primary key constraints on table "program_content_progress"
 */
export enum program_content_progress_constraint {
  program_content_progress_member_id_program_content_id_key = "program_content_progress_member_id_program_content_id_key",
  program_content_progress_pkey = "program_content_progress_pkey",
}

/**
 * update columns of table "program_content_progress"
 */
export enum program_content_progress_update_column {
  created_at = "created_at",
  id = "id",
  last_progress = "last_progress",
  member_id = "member_id",
  program_content_id = "program_content_id",
  progress = "progress",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "program_content_section"
 */
export enum program_content_section_constraint {
  program_content_section_pkey = "program_content_section_pkey",
}

/**
 * update columns of table "program_content_section"
 */
export enum program_content_section_update_column {
  description = "description",
  id = "id",
  position = "position",
  program_id = "program_id",
  title = "title",
}

/**
 * update columns of table "program_content"
 */
export enum program_content_update_column {
  abstract = "abstract",
  content_body_id = "content_body_id",
  content_section_id = "content_section_id",
  content_type = "content_type",
  created_at = "created_at",
  duration = "duration",
  id = "id",
  is_notify_update = "is_notify_update",
  list_price = "list_price",
  metadata = "metadata",
  notified_at = "notified_at",
  position = "position",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  title = "title",
}

/**
 * unique or primary key constraints on table "program_package_category"
 */
export enum program_package_category_constraint {
  program_package_category_pkey = "program_package_category_pkey",
}

/**
 * update columns of table "program_package_category"
 */
export enum program_package_category_update_column {
  category_id = "category_id",
  id = "id",
  position = "position",
  program_package_id = "program_package_id",
}

/**
 * unique or primary key constraints on table "program_package"
 */
export enum program_package_constraint {
  program_package_pkey = "program_package_pkey",
}

/**
 * unique or primary key constraints on table "program_package_plan"
 */
export enum program_package_plan_constraint {
  program_package_plan_pkey = "program_package_plan_pkey",
}

/**
 * update columns of table "program_package_plan"
 */
export enum program_package_plan_update_column {
  created_at = "created_at",
  description = "description",
  discount_down_price = "discount_down_price",
  id = "id",
  is_participants_visible = "is_participants_visible",
  is_subscription = "is_subscription",
  is_tempo_delivery = "is_tempo_delivery",
  list_price = "list_price",
  period_amount = "period_amount",
  period_type = "period_type",
  position = "position",
  program_package_id = "program_package_id",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  title = "title",
}

/**
 * unique or primary key constraints on table "program_package_program"
 */
export enum program_package_program_constraint {
  program_package_program_pkey = "program_package_program_pkey",
  program_package_program_program_package_id_program_id_key = "program_package_program_program_package_id_program_id_key",
}

/**
 * update columns of table "program_package_program"
 */
export enum program_package_program_update_column {
  id = "id",
  position = "position",
  program_id = "program_id",
  program_package_id = "program_package_id",
}

/**
 * update columns of table "program_package"
 */
export enum program_package_update_column {
  app_id = "app_id",
  cover_url = "cover_url",
  created_at = "created_at",
  creator_id = "creator_id",
  description = "description",
  id = "id",
  published_at = "published_at",
  title = "title",
}

/**
 * unique or primary key constraints on table "program_plan"
 */
export enum program_plan_constraint {
  program_plan_pkey = "program_plan_pkey",
}

/**
 * update columns of table "program_plan"
 */
export enum program_plan_update_column {
  auto_renewed = "auto_renewed",
  created_at = "created_at",
  currency_id = "currency_id",
  description = "description",
  discount_down_price = "discount_down_price",
  ended_at = "ended_at",
  gains = "gains",
  group_buying_people = "group_buying_people",
  id = "id",
  is_countdown_timer_visible = "is_countdown_timer_visible",
  is_participants_visible = "is_participants_visible",
  list_price = "list_price",
  period_amount = "period_amount",
  period_type = "period_type",
  program_id = "program_id",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  started_at = "started_at",
  title = "title",
  type = "type",
}

/**
 * unique or primary key constraints on table "program_related_item"
 */
export enum program_related_item_constraint {
  program_related_item_pkey = "program_related_item_pkey",
}

/**
 * update columns of table "program_related_item"
 */
export enum program_related_item_update_column {
  class = "class",
  id = "id",
  program_id = "program_id",
  target = "target",
  weight = "weight",
}

/**
 * unique or primary key constraints on table "program_role"
 */
export enum program_role_constraint {
  program_role_name_program_id_member_id_key = "program_role_name_program_id_member_id_key",
  program_role_pkey = "program_role_pkey",
}

/**
 * update columns of table "program_role"
 */
export enum program_role_update_column {
  id = "id",
  member_id = "member_id",
  name = "name",
  program_id = "program_id",
}

/**
 * unique or primary key constraints on table "program_tag"
 */
export enum program_tag_constraint {
  program_tag_pkey = "program_tag_pkey",
  program_tag_program_id_tag_name_key = "program_tag_program_id_tag_name_key",
}

/**
 * update columns of table "program_tag"
 */
export enum program_tag_update_column {
  id = "id",
  position = "position",
  program_id = "program_id",
  tag_name = "tag_name",
}

/**
 * unique or primary key constraints on table "program_tempo_delivery"
 */
export enum program_tempo_delivery_constraint {
  program_tempo_delivery_member_id_program_package_program_id_key = "program_tempo_delivery_member_id_program_package_program_id_key",
  program_tempo_delivery_pkey = "program_tempo_delivery_pkey",
}

/**
 * update columns of table "program_tempo_delivery"
 */
export enum program_tempo_delivery_update_column {
  delivered_at = "delivered_at",
  id = "id",
  member_id = "member_id",
  program_package_program_id = "program_package_program_id",
}

/**
 * update columns of table "program"
 */
export enum program_update_column {
  abstract = "abstract",
  app_id = "app_id",
  cover_url = "cover_url",
  cover_video_url = "cover_video_url",
  created_at = "created_at",
  description = "description",
  id = "id",
  in_advance = "in_advance",
  is_countdown_timer_visible = "is_countdown_timer_visible",
  is_deleted = "is_deleted",
  is_issues_open = "is_issues_open",
  is_private = "is_private",
  is_sold_out = "is_sold_out",
  is_subscription = "is_subscription",
  list_price = "list_price",
  position = "position",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  support_locales = "support_locales",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "project_category"
 */
export enum project_category_constraint {
  project_category_pkey = "project_category_pkey",
}

/**
 * update columns of table "project_category"
 */
export enum project_category_update_column {
  category_id = "category_id",
  id = "id",
  position = "position",
  project_id = "project_id",
}

/**
 * unique or primary key constraints on table "project"
 */
export enum project_constraint {
  project_pkey = "project_pkey",
}

/**
 * unique or primary key constraints on table "project_plan"
 */
export enum project_plan_constraint {
  project_plan_pkey = "project_plan_pkey",
}

/**
 * update columns of table "project_plan"
 */
export enum project_plan_update_column {
  auto_renewed = "auto_renewed",
  cover_url = "cover_url",
  created_at = "created_at",
  deliverables = "deliverables",
  description = "description",
  discount_down_price = "discount_down_price",
  id = "id",
  is_limited = "is_limited",
  is_participants_visible = "is_participants_visible",
  is_physical = "is_physical",
  is_subscription = "is_subscription",
  list_price = "list_price",
  options = "options",
  period_amount = "period_amount",
  period_type = "period_type",
  position = "position",
  project_id = "project_id",
  published_at = "published_at",
  sale_price = "sale_price",
  sold_at = "sold_at",
  title = "title",
}

/**
 * unique or primary key constraints on table "project_section"
 */
export enum project_section_constraint {
  project_section_pkey = "project_section_pkey",
}

/**
 * update columns of table "project_section"
 */
export enum project_section_update_column {
  id = "id",
  options = "options",
  position = "position",
  project_id = "project_id",
  type = "type",
}

/**
 * update columns of table "project"
 */
export enum project_update_column {
  abstract = "abstract",
  app_id = "app_id",
  comments = "comments",
  contents = "contents",
  cover_type = "cover_type",
  cover_url = "cover_url",
  created_at = "created_at",
  creator_id = "creator_id",
  description = "description",
  expired_at = "expired_at",
  id = "id",
  introduction = "introduction",
  is_countdown_timer_visible = "is_countdown_timer_visible",
  is_participants_visible = "is_participants_visible",
  position = "position",
  preview_url = "preview_url",
  published_at = "published_at",
  target_amount = "target_amount",
  target_unit = "target_unit",
  template = "template",
  title = "title",
  type = "type",
  updates = "updates",
}

/**
 * unique or primary key constraints on table "property"
 */
export enum property_constraint {
  property_pkey = "property_pkey",
}

/**
 * update columns of table "property"
 */
export enum property_update_column {
  app_id = "app_id",
  created_at = "created_at",
  id = "id",
  name = "name",
  placeholder = "placeholder",
  position = "position",
  type = "type",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "review"
 */
export enum review_constraint {
  review_pkey = "review_pkey",
}

/**
 * unique or primary key constraints on table "review_reply"
 */
export enum review_reply_constraint {
  review_reply_pkey = "review_reply_pkey",
}

/**
 * update columns of table "review_reply"
 */
export enum review_reply_update_column {
  content = "content",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  review_id = "review_id",
  updated_at = "updated_at",
}

/**
 * update columns of table "review"
 */
export enum review_update_column {
  app_id = "app_id",
  content = "content",
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  path = "path",
  private_content = "private_content",
  score = "score",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "role"
 */
export enum role_constraint {
  role_pkey = "role_pkey",
}

/**
 * unique or primary key constraints on table "role_permission"
 */
export enum role_permission_constraint {
  role_permission_pkey = "role_permission_pkey",
  role_permission_role_id_permission_id_key = "role_permission_role_id_permission_id_key",
}

/**
 * update columns of table "role_permission"
 */
export enum role_permission_update_column {
  created_at = "created_at",
  id = "id",
  permission_id = "permission_id",
  role_id = "role_id",
  updated_at = "updated_at",
}

/**
 * update columns of table "role"
 */
export enum role_update_column {
  created_at = "created_at",
  id = "id",
  name = "name",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "sharing_code"
 */
export enum sharing_code_constraint {
  sharing_code_pkey = "sharing_code_pkey",
}

/**
 * update columns of table "sharing_code"
 */
export enum sharing_code_update_column {
  app_id = "app_id",
  code = "code",
  created_at = "created_at",
  id = "id",
  note = "note",
  path = "path",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "social_card"
 */
export enum social_card_constraint {
  social_card_pkey = "social_card_pkey",
}

/**
 * unique or primary key constraints on table "social_card_subscriber"
 */
export enum social_card_subscriber_constraint {
  social_card_subscriber_pkey = "social_card_subscriber_pkey",
}

/**
 * update columns of table "social_card_subscriber"
 */
export enum social_card_subscriber_update_column {
  created_at = "created_at",
  ended_at = "ended_at",
  id = "id",
  member_channel_id = "member_channel_id",
  member_id = "member_id",
  social_card_id = "social_card_id",
  started_at = "started_at",
}

/**
 * update columns of table "social_card"
 */
export enum social_card_update_column {
  badge_url = "badge_url",
  description = "description",
  id = "id",
  member_social_id = "member_social_id",
  membership_id = "membership_id",
  name = "name",
}

/**
 * unique or primary key constraints on table "tag"
 */
export enum tag_constraint {
  tag_id_key = "tag_id_key",
  tag_pkey = "tag_pkey",
}

/**
 * update columns of table "tag"
 */
export enum tag_update_column {
  created_at = "created_at",
  name = "name",
  type = "type",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "voucher_code"
 */
export enum voucher_code_constraint {
  voucher_code_code_key = "voucher_code_code_key",
  voucher_code_pkey = "voucher_code_pkey",
}

/**
 * update columns of table "voucher_code"
 */
export enum voucher_code_update_column {
  code = "code",
  count = "count",
  id = "id",
  remaining = "remaining",
  voucher_plan_id = "voucher_plan_id",
}

/**
 * unique or primary key constraints on table "voucher"
 */
export enum voucher_constraint {
  voucher_pkey = "voucher_pkey",
  voucher_voucher_code_id_member_id_key = "voucher_voucher_code_id_member_id_key",
}

/**
 * unique or primary key constraints on table "voucher_plan"
 */
export enum voucher_plan_constraint {
  voucher_plan_pkey = "voucher_plan_pkey",
}

/**
 * unique or primary key constraints on table "voucher_plan_product"
 */
export enum voucher_plan_product_constraint {
  voucher_plan_product_pkey = "voucher_plan_product_pkey",
}

/**
 * update columns of table "voucher_plan_product"
 */
export enum voucher_plan_product_update_column {
  id = "id",
  product_id = "product_id",
  voucher_plan_id = "voucher_plan_id",
}

/**
 * update columns of table "voucher_plan"
 */
export enum voucher_plan_update_column {
  app_id = "app_id",
  description = "description",
  ended_at = "ended_at",
  id = "id",
  product_quantity_limit = "product_quantity_limit",
  started_at = "started_at",
  title = "title",
}

/**
 * update columns of table "voucher"
 */
export enum voucher_update_column {
  created_at = "created_at",
  id = "id",
  member_id = "member_id",
  voucher_code_id = "voucher_code_id",
}

/**
 * unique or primary key constraints on table "xuemi.assign_rule"
 */
export enum xuemi_assign_rule_constraint {
  assign_rule_pkey = "assign_rule_pkey",
}

/**
 * update columns of table "xuemi.assign_rule"
 */
export enum xuemi_assign_rule_update_column {
  id = "id",
  limit = "limit",
  member_id = "member_id",
  member_selector_id = "member_selector_id",
  position = "position",
  source_member_id = "source_member_id",
  target_member_id = "target_member_id",
  total_limit = "total_limit",
  trigger_id = "trigger_id",
}

/**
 * unique or primary key constraints on table "xuemi.member_selector"
 */
export enum xuemi_member_selector_constraint {
  member_selector_pkey = "member_selector_pkey",
}

/**
 * update columns of table "xuemi.member_selector"
 */
export enum xuemi_member_selector_update_column {
  condition = "condition",
  description = "description",
  id = "id",
  title = "title",
}

/**
 * unique or primary key constraints on table "xuemi.trigger"
 */
export enum xuemi_trigger_constraint {
  trigger_pkey = "trigger_pkey",
}

/**
 * update columns of table "xuemi.trigger"
 */
export enum xuemi_trigger_update_column {
  condition = "condition",
  description = "description",
  duration = "duration",
  id = "id",
  title = "title",
}

/**
 * expression to compare columns of type Boolean. All fields are combined with logical 'AND'.
 */
export interface Boolean_comparison_exp {
  _eq?: boolean | null;
  _gt?: boolean | null;
  _gte?: boolean | null;
  _in?: boolean[] | null;
  _is_null?: boolean | null;
  _lt?: boolean | null;
  _lte?: boolean | null;
  _neq?: boolean | null;
  _nin?: boolean[] | null;
}

/**
 * expression to compare columns of type Int. All fields are combined with logical 'AND'.
 */
export interface Int_comparison_exp {
  _eq?: number | null;
  _gt?: number | null;
  _gte?: number | null;
  _in?: number[] | null;
  _is_null?: boolean | null;
  _lt?: number | null;
  _lte?: number | null;
  _neq?: number | null;
  _nin?: number[] | null;
}

/**
 * expression to compare columns of type String. All fields are combined with logical 'AND'.
 */
export interface String_comparison_exp {
  _eq?: string | null;
  _gt?: string | null;
  _gte?: string | null;
  _ilike?: string | null;
  _in?: string[] | null;
  _is_null?: boolean | null;
  _like?: string | null;
  _lt?: string | null;
  _lte?: string | null;
  _neq?: string | null;
  _nilike?: string | null;
  _nin?: string[] | null;
  _nlike?: string | null;
  _nsimilar?: string | null;
  _similar?: string | null;
}

/**
 * input type for inserting array relation for remote table "activity"
 */
export interface activity_arr_rel_insert_input {
  data: activity_insert_input[];
  on_conflict?: activity_on_conflict | null;
}

/**
 * input type for inserting array relation for remote table "activity_attendance"
 */
export interface activity_attendance_arr_rel_insert_input {
  data: activity_attendance_insert_input[];
  on_conflict?: activity_attendance_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "activity_attendance". All fields are combined with a logical 'AND'.
 */
export interface activity_attendance_bool_exp {
  _and?: (activity_attendance_bool_exp | null)[] | null;
  _not?: activity_attendance_bool_exp | null;
  _or?: (activity_attendance_bool_exp | null)[] | null;
  activity_session?: activity_session_bool_exp | null;
  activity_session_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  order_product?: order_product_bool_exp | null;
  order_product_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity_attendance"
 */
export interface activity_attendance_insert_input {
  activity_session?: activity_session_obj_rel_insert_input | null;
  activity_session_id?: any | null;
  created_at?: any | null;
  id?: any | null;
  order_product?: order_product_obj_rel_insert_input | null;
  order_product_id?: any | null;
}

/**
 * on conflict condition type for table "activity_attendance"
 */
export interface activity_attendance_on_conflict {
  constraint: activity_attendance_constraint;
  update_columns: activity_attendance_update_column[];
  where?: activity_attendance_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "activity". All fields are combined with a logical 'AND'.
 */
export interface activity_bool_exp {
  _and?: (activity_bool_exp | null)[] | null;
  _not?: activity_bool_exp | null;
  _or?: (activity_bool_exp | null)[] | null;
  activity_categories?: activity_category_bool_exp | null;
  activity_enrollments?: activity_enrollment_bool_exp | null;
  activity_sessions?: activity_session_bool_exp | null;
  activity_tags?: activity_tag_bool_exp | null;
  activity_tickets?: activity_ticket_bool_exp | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_participants_visible?: Boolean_comparison_exp | null;
  organizer?: member_public_bool_exp | null;
  organizer_id?: String_comparison_exp | null;
  package_items?: package_item_bool_exp | null;
  position?: Int_comparison_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  support_locales?: jsonb_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "activity_category"
 */
export interface activity_category_arr_rel_insert_input {
  data: activity_category_insert_input[];
  on_conflict?: activity_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "activity_category". All fields are combined with a logical 'AND'.
 */
export interface activity_category_bool_exp {
  _and?: (activity_category_bool_exp | null)[] | null;
  _not?: activity_category_bool_exp | null;
  _or?: (activity_category_bool_exp | null)[] | null;
  activity?: activity_bool_exp | null;
  activity_id?: uuid_comparison_exp | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity_category"
 */
export interface activity_category_insert_input {
  activity?: activity_obj_rel_insert_input | null;
  activity_id?: any | null;
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  position?: number | null;
}

/**
 * on conflict condition type for table "activity_category"
 */
export interface activity_category_on_conflict {
  constraint: activity_category_constraint;
  update_columns: activity_category_update_column[];
  where?: activity_category_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "activity_enrollment". All fields are combined with a logical 'AND'.
 */
export interface activity_enrollment_bool_exp {
  _and?: (activity_enrollment_bool_exp | null)[] | null;
  _not?: activity_enrollment_bool_exp | null;
  _or?: (activity_enrollment_bool_exp | null)[] | null;
  activity?: activity_bool_exp | null;
  activity_id?: uuid_comparison_exp | null;
  activity_session_id?: uuid_comparison_exp | null;
  activity_ticket?: activity_ticket_bool_exp | null;
  activity_ticket_id?: uuid_comparison_exp | null;
  attended?: Boolean_comparison_exp | null;
  member_email?: String_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  member_name?: String_comparison_exp | null;
  member_phone?: String_comparison_exp | null;
  order_log_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity"
 */
export interface activity_insert_input {
  activity_categories?: activity_category_arr_rel_insert_input | null;
  activity_sessions?: activity_session_arr_rel_insert_input | null;
  activity_tags?: activity_tag_arr_rel_insert_input | null;
  activity_tickets?: activity_ticket_arr_rel_insert_input | null;
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  cover_url?: string | null;
  description?: string | null;
  id?: any | null;
  is_participants_visible?: boolean | null;
  organizer_id?: string | null;
  package_items?: package_item_arr_rel_insert_input | null;
  position?: number | null;
  published_at?: any | null;
  support_locales?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "activity"
 */
export interface activity_obj_rel_insert_input {
  data: activity_insert_input;
  on_conflict?: activity_on_conflict | null;
}

/**
 * on conflict condition type for table "activity"
 */
export interface activity_on_conflict {
  constraint: activity_constraint;
  update_columns: activity_update_column[];
  where?: activity_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "activity_session"
 */
export interface activity_session_arr_rel_insert_input {
  data: activity_session_insert_input[];
  on_conflict?: activity_session_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "activity_session". All fields are combined with a logical 'AND'.
 */
export interface activity_session_bool_exp {
  _and?: (activity_session_bool_exp | null)[] | null;
  _not?: activity_session_bool_exp | null;
  _or?: (activity_session_bool_exp | null)[] | null;
  activity?: activity_bool_exp | null;
  activity_attendances?: activity_attendance_bool_exp | null;
  activity_enrollments?: activity_enrollment_bool_exp | null;
  activity_id?: uuid_comparison_exp | null;
  activity_session_tickets?: activity_session_ticket_bool_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  location?: String_comparison_exp | null;
  location_online?: String_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  threshold?: numeric_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity_session"
 */
export interface activity_session_insert_input {
  activity?: activity_obj_rel_insert_input | null;
  activity_attendances?: activity_attendance_arr_rel_insert_input | null;
  activity_id?: any | null;
  activity_session_tickets?: activity_session_ticket_arr_rel_insert_input | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  location?: string | null;
  location_online?: string | null;
  started_at?: any | null;
  threshold?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "activity_session"
 */
export interface activity_session_obj_rel_insert_input {
  data: activity_session_insert_input;
  on_conflict?: activity_session_on_conflict | null;
}

/**
 * on conflict condition type for table "activity_session"
 */
export interface activity_session_on_conflict {
  constraint: activity_session_constraint;
  update_columns: activity_session_update_column[];
  where?: activity_session_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "activity_session_ticket"
 */
export interface activity_session_ticket_arr_rel_insert_input {
  data: activity_session_ticket_insert_input[];
  on_conflict?: activity_session_ticket_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "activity_session_ticket". All fields are combined with a logical 'AND'.
 */
export interface activity_session_ticket_bool_exp {
  _and?: (activity_session_ticket_bool_exp | null)[] | null;
  _not?: activity_session_ticket_bool_exp | null;
  _or?: (activity_session_ticket_bool_exp | null)[] | null;
  activity_session?: activity_session_bool_exp | null;
  activity_session_id?: uuid_comparison_exp | null;
  activity_session_type?: String_comparison_exp | null;
  activity_ticket?: activity_ticket_bool_exp | null;
  activity_ticket_id?: uuid_comparison_exp | null;
  id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity_session_ticket"
 */
export interface activity_session_ticket_insert_input {
  activity_session?: activity_session_obj_rel_insert_input | null;
  activity_session_id?: any | null;
  activity_session_type?: string | null;
  activity_ticket?: activity_ticket_obj_rel_insert_input | null;
  activity_ticket_id?: any | null;
  id?: any | null;
}

/**
 * on conflict condition type for table "activity_session_ticket"
 */
export interface activity_session_ticket_on_conflict {
  constraint: activity_session_ticket_constraint;
  update_columns: activity_session_ticket_update_column[];
  where?: activity_session_ticket_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "activity_tag"
 */
export interface activity_tag_arr_rel_insert_input {
  data: activity_tag_insert_input[];
  on_conflict?: activity_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "activity_tag". All fields are combined with a logical 'AND'.
 */
export interface activity_tag_bool_exp {
  _and?: (activity_tag_bool_exp | null)[] | null;
  _not?: activity_tag_bool_exp | null;
  _or?: (activity_tag_bool_exp | null)[] | null;
  activity?: activity_bool_exp | null;
  activity_id?: uuid_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity_tag"
 */
export interface activity_tag_insert_input {
  activity?: activity_obj_rel_insert_input | null;
  activity_id?: any | null;
  id?: any | null;
  position?: number | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
}

/**
 * on conflict condition type for table "activity_tag"
 */
export interface activity_tag_on_conflict {
  constraint: activity_tag_constraint;
  update_columns: activity_tag_update_column[];
  where?: activity_tag_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "activity_ticket"
 */
export interface activity_ticket_arr_rel_insert_input {
  data: activity_ticket_insert_input[];
  on_conflict?: activity_ticket_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "activity_ticket". All fields are combined with a logical 'AND'.
 */
export interface activity_ticket_bool_exp {
  _and?: (activity_ticket_bool_exp | null)[] | null;
  _not?: activity_ticket_bool_exp | null;
  _or?: (activity_ticket_bool_exp | null)[] | null;
  activity?: activity_bool_exp | null;
  activity_enrollments?: activity_enrollment_bool_exp | null;
  activity_id?: uuid_comparison_exp | null;
  activity_session_tickets?: activity_session_ticket_bool_exp | null;
  activity_ticket_enrollments?: activity_ticket_enrollment_bool_exp | null;
  count?: Int_comparison_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_published?: Boolean_comparison_exp | null;
  price?: numeric_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "activity_ticket_enrollment". All fields are combined with a logical 'AND'.
 */
export interface activity_ticket_enrollment_bool_exp {
  _and?: (activity_ticket_enrollment_bool_exp | null)[] | null;
  _not?: activity_ticket_enrollment_bool_exp | null;
  _or?: (activity_ticket_enrollment_bool_exp | null)[] | null;
  activity_ticket?: activity_ticket_bool_exp | null;
  activity_ticket_id?: uuid_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  order_log_id?: String_comparison_exp | null;
  order_product_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "activity_ticket"
 */
export interface activity_ticket_insert_input {
  activity?: activity_obj_rel_insert_input | null;
  activity_id?: any | null;
  activity_session_tickets?: activity_session_ticket_arr_rel_insert_input | null;
  count?: number | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  is_published?: boolean | null;
  price?: any | null;
  started_at?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "activity_ticket"
 */
export interface activity_ticket_obj_rel_insert_input {
  data: activity_ticket_insert_input;
  on_conflict?: activity_ticket_on_conflict | null;
}

/**
 * on conflict condition type for table "activity_ticket"
 */
export interface activity_ticket_on_conflict {
  constraint: activity_ticket_constraint;
  update_columns: activity_ticket_update_column[];
  where?: activity_ticket_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "app_admin"
 */
export interface app_admin_arr_rel_insert_input {
  data: app_admin_insert_input[];
  on_conflict?: app_admin_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "app_admin". All fields are combined with a logical 'AND'.
 */
export interface app_admin_bool_exp {
  _and?: (app_admin_bool_exp | null)[] | null;
  _not?: app_admin_bool_exp | null;
  _or?: (app_admin_bool_exp | null)[] | null;
  api_host?: String_comparison_exp | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  host?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "app_admin"
 */
export interface app_admin_insert_input {
  api_host?: string | null;
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  host?: string | null;
  position?: number | null;
}

/**
 * on conflict condition type for table "app_admin"
 */
export interface app_admin_on_conflict {
  constraint: app_admin_constraint;
  update_columns: app_admin_update_column[];
  where?: app_admin_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "app". All fields are combined with a logical 'AND'.
 */
export interface app_bool_exp {
  _and?: (app_bool_exp | null)[] | null;
  _not?: app_bool_exp | null;
  _or?: (app_bool_exp | null)[] | null;
  activities?: activity_bool_exp | null;
  app_admins?: app_admin_bool_exp | null;
  app_modules?: app_module_bool_exp | null;
  app_navs?: app_nav_bool_exp | null;
  app_secrets?: app_secret_bool_exp | null;
  app_settings?: app_setting_bool_exp | null;
  cards?: card_bool_exp | null;
  cart_items?: cart_item_bool_exp | null;
  comments?: comment_bool_exp | null;
  description?: String_comparison_exp | null;
  id?: String_comparison_exp | null;
  issues?: issue_bool_exp | null;
  members?: member_bool_exp | null;
  merchandises?: merchandise_bool_exp | null;
  name?: String_comparison_exp | null;
  packages?: package_bool_exp | null;
  podcasts?: podcast_bool_exp | null;
  point_discount_ratio?: numeric_comparison_exp | null;
  point_exchange_rate?: numeric_comparison_exp | null;
  point_validity_period?: numeric_comparison_exp | null;
  posts?: post_bool_exp | null;
  program_packages?: program_package_bool_exp | null;
  programs?: program_bool_exp | null;
  properties?: property_bool_exp | null;
  sharing_codes?: sharing_code_bool_exp | null;
  title?: String_comparison_exp | null;
  vimeo_project_id?: String_comparison_exp | null;
  voucher_plans?: voucher_plan_bool_exp | null;
}

/**
 * input type for inserting data into table "app"
 */
export interface app_insert_input {
  activities?: activity_arr_rel_insert_input | null;
  app_admins?: app_admin_arr_rel_insert_input | null;
  app_modules?: app_module_arr_rel_insert_input | null;
  app_navs?: app_nav_arr_rel_insert_input | null;
  app_secrets?: app_secret_arr_rel_insert_input | null;
  app_settings?: app_setting_arr_rel_insert_input | null;
  cards?: card_arr_rel_insert_input | null;
  cart_items?: cart_item_arr_rel_insert_input | null;
  comments?: comment_arr_rel_insert_input | null;
  description?: string | null;
  id?: string | null;
  issues?: issue_arr_rel_insert_input | null;
  members?: member_arr_rel_insert_input | null;
  merchandises?: merchandise_arr_rel_insert_input | null;
  name?: string | null;
  packages?: package_arr_rel_insert_input | null;
  podcasts?: podcast_arr_rel_insert_input | null;
  point_discount_ratio?: any | null;
  point_exchange_rate?: any | null;
  point_validity_period?: any | null;
  posts?: post_arr_rel_insert_input | null;
  program_packages?: program_package_arr_rel_insert_input | null;
  programs?: program_arr_rel_insert_input | null;
  properties?: property_arr_rel_insert_input | null;
  sharing_codes?: sharing_code_arr_rel_insert_input | null;
  title?: string | null;
  vimeo_project_id?: string | null;
  voucher_plans?: voucher_plan_arr_rel_insert_input | null;
}

/**
 * input type for inserting array relation for remote table "app_module"
 */
export interface app_module_arr_rel_insert_input {
  data: app_module_insert_input[];
  on_conflict?: app_module_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "app_module". All fields are combined with a logical 'AND'.
 */
export interface app_module_bool_exp {
  _and?: (app_module_bool_exp | null)[] | null;
  _not?: app_module_bool_exp | null;
  _or?: (app_module_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  module?: module_bool_exp | null;
  module_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "app_module"
 */
export interface app_module_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  created_at?: any | null;
  id?: any | null;
  module?: module_obj_rel_insert_input | null;
  module_id?: string | null;
}

/**
 * on conflict condition type for table "app_module"
 */
export interface app_module_on_conflict {
  constraint: app_module_constraint;
  update_columns: app_module_update_column[];
  where?: app_module_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "app_nav"
 */
export interface app_nav_arr_rel_insert_input {
  data: app_nav_insert_input[];
  on_conflict?: app_nav_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "app_nav". All fields are combined with a logical 'AND'.
 */
export interface app_nav_bool_exp {
  _and?: (app_nav_bool_exp | null)[] | null;
  _not?: app_nav_bool_exp | null;
  _or?: (app_nav_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  block?: String_comparison_exp | null;
  external?: Boolean_comparison_exp | null;
  href?: String_comparison_exp | null;
  icon?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  label?: String_comparison_exp | null;
  locale?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  tag?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "app_nav"
 */
export interface app_nav_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  block?: string | null;
  external?: boolean | null;
  href?: string | null;
  icon?: string | null;
  id?: any | null;
  label?: string | null;
  locale?: string | null;
  position?: number | null;
  tag?: string | null;
}

/**
 * on conflict condition type for table "app_nav"
 */
export interface app_nav_on_conflict {
  constraint: app_nav_constraint;
  update_columns: app_nav_update_column[];
  where?: app_nav_bool_exp | null;
}

/**
 * input type for inserting object relation for remote table "app"
 */
export interface app_obj_rel_insert_input {
  data: app_insert_input;
  on_conflict?: app_on_conflict | null;
}

/**
 * on conflict condition type for table "app"
 */
export interface app_on_conflict {
  constraint: app_constraint;
  update_columns: app_update_column[];
  where?: app_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "app_secret"
 */
export interface app_secret_arr_rel_insert_input {
  data: app_secret_insert_input[];
  on_conflict?: app_secret_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "app_secret". All fields are combined with a logical 'AND'.
 */
export interface app_secret_bool_exp {
  _and?: (app_secret_bool_exp | null)[] | null;
  _not?: app_secret_bool_exp | null;
  _or?: (app_secret_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  key?: String_comparison_exp | null;
  value?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "app_secret"
 */
export interface app_secret_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  id?: any | null;
  key?: string | null;
  value?: string | null;
}

/**
 * on conflict condition type for table "app_secret"
 */
export interface app_secret_on_conflict {
  constraint: app_secret_constraint;
  update_columns: app_secret_update_column[];
  where?: app_secret_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "app_setting"
 */
export interface app_setting_arr_rel_insert_input {
  data: app_setting_insert_input[];
  on_conflict?: app_setting_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "app_setting". All fields are combined with a logical 'AND'.
 */
export interface app_setting_bool_exp {
  _and?: (app_setting_bool_exp | null)[] | null;
  _not?: app_setting_bool_exp | null;
  _or?: (app_setting_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  key?: String_comparison_exp | null;
  value?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "app_setting"
 */
export interface app_setting_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  id?: any | null;
  key?: string | null;
  value?: string | null;
}

/**
 * on conflict condition type for table "app_setting"
 */
export interface app_setting_on_conflict {
  constraint: app_setting_constraint;
  update_columns: app_setting_update_column[];
  where?: app_setting_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "appointment_enrollment". All fields are combined with a logical 'AND'.
 */
export interface appointment_enrollment_bool_exp {
  _and?: (appointment_enrollment_bool_exp | null)[] | null;
  _not?: appointment_enrollment_bool_exp | null;
  _or?: (appointment_enrollment_bool_exp | null)[] | null;
  appointment_plan?: appointment_plan_bool_exp | null;
  appointment_plan_id?: uuid_comparison_exp | null;
  canceled_at?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  issue?: String_comparison_exp | null;
  join_url?: String_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_email?: String_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  member_name?: String_comparison_exp | null;
  member_phone?: String_comparison_exp | null;
  order_product?: order_product_bool_exp | null;
  order_product_id?: uuid_comparison_exp | null;
  result?: String_comparison_exp | null;
  start_url?: String_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "appointment_period". All fields are combined with a logical 'AND'.
 */
export interface appointment_period_bool_exp {
  _and?: (appointment_period_bool_exp | null)[] | null;
  _not?: appointment_period_bool_exp | null;
  _or?: (appointment_period_bool_exp | null)[] | null;
  appointment_plan?: appointment_plan_bool_exp | null;
  appointment_plan_id?: uuid_comparison_exp | null;
  appointment_schedule?: appointment_schedule_bool_exp | null;
  appointment_schedule_id?: uuid_comparison_exp | null;
  available?: Boolean_comparison_exp | null;
  booked?: Boolean_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "appointment_plan"
 */
export interface appointment_plan_arr_rel_insert_input {
  data: appointment_plan_insert_input[];
  on_conflict?: appointment_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "appointment_plan". All fields are combined with a logical 'AND'.
 */
export interface appointment_plan_bool_exp {
  _and?: (appointment_plan_bool_exp | null)[] | null;
  _not?: appointment_plan_bool_exp | null;
  _or?: (appointment_plan_bool_exp | null)[] | null;
  appointment_enrollments?: appointment_enrollment_bool_exp | null;
  appointment_periods?: appointment_period_bool_exp | null;
  appointment_schedules?: appointment_schedule_bool_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  creator?: member_public_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  currency?: currency_bool_exp | null;
  currency_id?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  duration?: numeric_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_private?: Boolean_comparison_exp | null;
  phone?: String_comparison_exp | null;
  price?: numeric_comparison_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  reservation_amount?: numeric_comparison_exp | null;
  reservation_type?: String_comparison_exp | null;
  support_locales?: jsonb_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "appointment_plan"
 */
export interface appointment_plan_insert_input {
  appointment_schedules?: appointment_schedule_arr_rel_insert_input | null;
  created_at?: any | null;
  creator_id?: string | null;
  currency?: currency_obj_rel_insert_input | null;
  currency_id?: string | null;
  description?: string | null;
  duration?: any | null;
  id?: any | null;
  is_private?: boolean | null;
  phone?: string | null;
  price?: any | null;
  published_at?: any | null;
  reservation_amount?: any | null;
  reservation_type?: string | null;
  support_locales?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "appointment_plan"
 */
export interface appointment_plan_obj_rel_insert_input {
  data: appointment_plan_insert_input;
  on_conflict?: appointment_plan_on_conflict | null;
}

/**
 * on conflict condition type for table "appointment_plan"
 */
export interface appointment_plan_on_conflict {
  constraint: appointment_plan_constraint;
  update_columns: appointment_plan_update_column[];
  where?: appointment_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "appointment_schedule"
 */
export interface appointment_schedule_arr_rel_insert_input {
  data: appointment_schedule_insert_input[];
  on_conflict?: appointment_schedule_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "appointment_schedule". All fields are combined with a logical 'AND'.
 */
export interface appointment_schedule_bool_exp {
  _and?: (appointment_schedule_bool_exp | null)[] | null;
  _not?: appointment_schedule_bool_exp | null;
  _or?: (appointment_schedule_bool_exp | null)[] | null;
  appointment_plan?: appointment_plan_bool_exp | null;
  appointment_plan_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  excludes?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  interval_amount?: Int_comparison_exp | null;
  interval_type?: String_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "appointment_schedule"
 */
export interface appointment_schedule_insert_input {
  appointment_plan?: appointment_plan_obj_rel_insert_input | null;
  appointment_plan_id?: any | null;
  created_at?: any | null;
  excludes?: any | null;
  id?: any | null;
  interval_amount?: number | null;
  interval_type?: string | null;
  started_at?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "appointment_schedule"
 */
export interface appointment_schedule_on_conflict {
  constraint: appointment_schedule_constraint;
  update_columns: appointment_schedule_update_column[];
  where?: appointment_schedule_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "attachment". All fields are combined with a logical 'AND'.
 */
export interface attachment_bool_exp {
  _and?: (attachment_bool_exp | null)[] | null;
  _not?: attachment_bool_exp | null;
  _or?: (attachment_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  target?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "attachment"
 */
export interface attachment_insert_input {
  app_id?: string | null;
  created_at?: any | null;
  data?: any | null;
  id?: any | null;
  is_deleted?: boolean | null;
  options?: any | null;
  target?: string | null;
  type?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "attachment"
 */
export interface attachment_obj_rel_insert_input {
  data: attachment_insert_input;
  on_conflict?: attachment_on_conflict | null;
}

/**
 * on conflict condition type for table "attachment"
 */
export interface attachment_on_conflict {
  constraint: attachment_constraint;
  update_columns: attachment_update_column[];
  where?: attachment_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "attend"
 */
export interface attend_arr_rel_insert_input {
  data: attend_insert_input[];
  on_conflict?: attend_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "attend". All fields are combined with a logical 'AND'.
 */
export interface attend_bool_exp {
  _and?: (attend_bool_exp | null)[] | null;
  _not?: attend_bool_exp | null;
  _or?: (attend_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "attend"
 */
export interface attend_insert_input {
  created_at?: any | null;
  ended_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  started_at?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "attend"
 */
export interface attend_on_conflict {
  constraint: attend_constraint;
  update_columns: attend_update_column[];
  where?: attend_bool_exp | null;
}

/**
 * expression to compare columns of type bigint. All fields are combined with logical 'AND'.
 */
export interface bigint_comparison_exp {
  _eq?: any | null;
  _gt?: any | null;
  _gte?: any | null;
  _in?: any[] | null;
  _is_null?: boolean | null;
  _lt?: any | null;
  _lte?: any | null;
  _neq?: any | null;
  _nin?: any[] | null;
}

/**
 * input type for inserting array relation for remote table "card"
 */
export interface card_arr_rel_insert_input {
  data: card_insert_input[];
  on_conflict?: card_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "card". All fields are combined with a logical 'AND'.
 */
export interface card_bool_exp {
  _and?: (card_bool_exp | null)[] | null;
  _not?: card_bool_exp | null;
  _or?: (card_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  card_discounts?: card_discount_bool_exp | null;
  card_enrollments?: card_enrollment_bool_exp | null;
  creator?: member_public_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  template?: String_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "card_discount"
 */
export interface card_discount_arr_rel_insert_input {
  data: card_discount_insert_input[];
  on_conflict?: card_discount_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "card_discount". All fields are combined with a logical 'AND'.
 */
export interface card_discount_bool_exp {
  _and?: (card_discount_bool_exp | null)[] | null;
  _not?: card_discount_bool_exp | null;
  _or?: (card_discount_bool_exp | null)[] | null;
  amount?: numeric_comparison_exp | null;
  card?: card_bool_exp | null;
  card_id?: uuid_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "card_discount"
 */
export interface card_discount_insert_input {
  amount?: any | null;
  card?: card_obj_rel_insert_input | null;
  card_id?: any | null;
  id?: any | null;
  product?: product_obj_rel_insert_input | null;
  product_id?: string | null;
  type?: string | null;
}

/**
 * on conflict condition type for table "card_discount"
 */
export interface card_discount_on_conflict {
  constraint: card_discount_constraint;
  update_columns: card_discount_update_column[];
  where?: card_discount_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "card_enrollment". All fields are combined with a logical 'AND'.
 */
export interface card_enrollment_bool_exp {
  _and?: (card_enrollment_bool_exp | null)[] | null;
  _not?: card_enrollment_bool_exp | null;
  _or?: (card_enrollment_bool_exp | null)[] | null;
  card?: card_bool_exp | null;
  card_id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "card"
 */
export interface card_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  card_discounts?: card_discount_arr_rel_insert_input | null;
  creator_id?: string | null;
  description?: string | null;
  id?: any | null;
  template?: string | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "card"
 */
export interface card_obj_rel_insert_input {
  data: card_insert_input;
  on_conflict?: card_on_conflict | null;
}

/**
 * on conflict condition type for table "card"
 */
export interface card_on_conflict {
  constraint: card_constraint;
  update_columns: card_update_column[];
  where?: card_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "cart_item"
 */
export interface cart_item_arr_rel_insert_input {
  data: cart_item_insert_input[];
  on_conflict?: cart_item_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "cart_item". All fields are combined with a logical 'AND'.
 */
export interface cart_item_bool_exp {
  _and?: (cart_item_bool_exp | null)[] | null;
  _not?: cart_item_bool_exp | null;
  _or?: (cart_item_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  class?: String_comparison_exp | null;
  fingerprint?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  target?: jsonb_comparison_exp | null;
}

/**
 * input type for inserting data into table "cart_item"
 */
export interface cart_item_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  class?: string | null;
  fingerprint?: string | null;
  id?: any | null;
  target?: any | null;
}

/**
 * on conflict condition type for table "cart_item"
 */
export interface cart_item_on_conflict {
  constraint: cart_item_constraint;
  update_columns: cart_item_update_column[];
  where?: cart_item_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "cart_product"
 */
export interface cart_product_arr_rel_insert_input {
  data: cart_product_insert_input[];
  on_conflict?: cart_product_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "cart_product". All fields are combined with a logical 'AND'.
 */
export interface cart_product_bool_exp {
  _and?: (cart_product_bool_exp | null)[] | null;
  _not?: cart_product_bool_exp | null;
  _or?: (cart_product_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "cart_product"
 */
export interface cart_product_insert_input {
  app_id?: string | null;
  created_at?: any | null;
  id?: any | null;
  member_id?: string | null;
  product?: product_obj_rel_insert_input | null;
  product_id?: string | null;
}

/**
 * on conflict condition type for table "cart_product"
 */
export interface cart_product_on_conflict {
  constraint: cart_product_constraint;
  update_columns: cart_product_update_column[];
  where?: cart_product_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "category". All fields are combined with a logical 'AND'.
 */
export interface category_bool_exp {
  _and?: (category_bool_exp | null)[] | null;
  _not?: category_bool_exp | null;
  _or?: (category_bool_exp | null)[] | null;
  activity_categories?: activity_category_bool_exp | null;
  app_id?: String_comparison_exp | null;
  class?: String_comparison_exp | null;
  creator_categories?: creator_category_bool_exp | null;
  id?: String_comparison_exp | null;
  member_categories?: member_category_bool_exp | null;
  member_tasks?: member_task_bool_exp | null;
  merchandise_categories?: merchandise_category_bool_exp | null;
  name?: String_comparison_exp | null;
  podcast_program_categories?: podcast_program_category_bool_exp | null;
  position?: Int_comparison_exp | null;
  post_categories?: post_category_bool_exp | null;
  program_categories?: program_category_bool_exp | null;
  program_package_categories?: program_package_category_bool_exp | null;
  project_categories?: project_category_bool_exp | null;
}

/**
 * input type for inserting data into table "category"
 */
export interface category_insert_input {
  activity_categories?: activity_category_arr_rel_insert_input | null;
  app_id?: string | null;
  class?: string | null;
  creator_categories?: creator_category_arr_rel_insert_input | null;
  id?: string | null;
  member_categories?: member_category_arr_rel_insert_input | null;
  member_tasks?: member_task_arr_rel_insert_input | null;
  merchandise_categories?: merchandise_category_arr_rel_insert_input | null;
  name?: string | null;
  podcast_program_categories?: podcast_program_category_arr_rel_insert_input | null;
  position?: number | null;
  post_categories?: post_category_arr_rel_insert_input | null;
  program_categories?: program_category_arr_rel_insert_input | null;
  program_package_categories?: program_package_category_arr_rel_insert_input | null;
  project_categories?: project_category_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "category"
 */
export interface category_obj_rel_insert_input {
  data: category_insert_input;
  on_conflict?: category_on_conflict | null;
}

/**
 * on conflict condition type for table "category"
 */
export interface category_on_conflict {
  constraint: category_constraint;
  update_columns: category_update_column[];
  where?: category_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "coin_log"
 */
export interface coin_log_arr_rel_insert_input {
  data: coin_log_insert_input[];
  on_conflict?: coin_log_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "coin_log". All fields are combined with a logical 'AND'.
 */
export interface coin_log_bool_exp {
  _and?: (coin_log_bool_exp | null)[] | null;
  _not?: coin_log_bool_exp | null;
  _or?: (coin_log_bool_exp | null)[] | null;
  amount?: numeric_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  note?: String_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "coin_log"
 */
export interface coin_log_insert_input {
  amount?: any | null;
  created_at?: any | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  note?: string | null;
  started_at?: any | null;
  title?: string | null;
}

/**
 * on conflict condition type for table "coin_log"
 */
export interface coin_log_on_conflict {
  constraint: coin_log_constraint;
  update_columns: coin_log_update_column[];
  where?: coin_log_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "coin_status". All fields are combined with a logical 'AND'.
 */
export interface coin_status_bool_exp {
  _and?: (coin_status_bool_exp | null)[] | null;
  _not?: coin_status_bool_exp | null;
  _or?: (coin_status_bool_exp | null)[] | null;
  amount?: numeric_comparison_exp | null;
  coin_id?: uuid_comparison_exp | null;
  coin_log?: coin_log_bool_exp | null;
  member_id?: String_comparison_exp | null;
  remaining?: numeric_comparison_exp | null;
  used_coins?: numeric_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "comment"
 */
export interface comment_arr_rel_insert_input {
  data: comment_insert_input[];
  on_conflict?: comment_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "comment". All fields are combined with a logical 'AND'.
 */
export interface comment_bool_exp {
  _and?: (comment_bool_exp | null)[] | null;
  _not?: comment_bool_exp | null;
  _or?: (comment_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  comment_reactions?: comment_reaction_bool_exp | null;
  comment_replies?: comment_reply_bool_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  thread_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "comment"
 */
export interface comment_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  comment_reactions?: comment_reaction_arr_rel_insert_input | null;
  comment_replies?: comment_reply_arr_rel_insert_input | null;
  content?: string | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  thread_id?: string | null;
}

/**
 * input type for inserting object relation for remote table "comment"
 */
export interface comment_obj_rel_insert_input {
  data: comment_insert_input;
  on_conflict?: comment_on_conflict | null;
}

/**
 * on conflict condition type for table "comment"
 */
export interface comment_on_conflict {
  constraint: comment_constraint;
  update_columns: comment_update_column[];
  where?: comment_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "comment_reaction"
 */
export interface comment_reaction_arr_rel_insert_input {
  data: comment_reaction_insert_input[];
  on_conflict?: comment_reaction_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "comment_reaction". All fields are combined with a logical 'AND'.
 */
export interface comment_reaction_bool_exp {
  _and?: (comment_reaction_bool_exp | null)[] | null;
  _not?: comment_reaction_bool_exp | null;
  _or?: (comment_reaction_bool_exp | null)[] | null;
  comment?: comment_bool_exp | null;
  comment_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "comment_reaction"
 */
export interface comment_reaction_insert_input {
  comment?: comment_obj_rel_insert_input | null;
  comment_id?: any | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * on conflict condition type for table "comment_reaction"
 */
export interface comment_reaction_on_conflict {
  constraint: comment_reaction_constraint;
  update_columns: comment_reaction_update_column[];
  where?: comment_reaction_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "comment_reply"
 */
export interface comment_reply_arr_rel_insert_input {
  data: comment_reply_insert_input[];
  on_conflict?: comment_reply_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "comment_reply". All fields are combined with a logical 'AND'.
 */
export interface comment_reply_bool_exp {
  _and?: (comment_reply_bool_exp | null)[] | null;
  _not?: comment_reply_bool_exp | null;
  _or?: (comment_reply_bool_exp | null)[] | null;
  comment?: comment_bool_exp | null;
  comment_id?: uuid_comparison_exp | null;
  comment_reply_reactions?: comment_reply_reaction_bool_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "comment_reply"
 */
export interface comment_reply_insert_input {
  comment?: comment_obj_rel_insert_input | null;
  comment_id?: any | null;
  comment_reply_reactions?: comment_reply_reaction_arr_rel_insert_input | null;
  content?: string | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * input type for inserting object relation for remote table "comment_reply"
 */
export interface comment_reply_obj_rel_insert_input {
  data: comment_reply_insert_input;
  on_conflict?: comment_reply_on_conflict | null;
}

/**
 * on conflict condition type for table "comment_reply"
 */
export interface comment_reply_on_conflict {
  constraint: comment_reply_constraint;
  update_columns: comment_reply_update_column[];
  where?: comment_reply_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "comment_reply_reaction"
 */
export interface comment_reply_reaction_arr_rel_insert_input {
  data: comment_reply_reaction_insert_input[];
  on_conflict?: comment_reply_reaction_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "comment_reply_reaction". All fields are combined with a logical 'AND'.
 */
export interface comment_reply_reaction_bool_exp {
  _and?: (comment_reply_reaction_bool_exp | null)[] | null;
  _not?: comment_reply_reaction_bool_exp | null;
  _or?: (comment_reply_reaction_bool_exp | null)[] | null;
  comment_reply?: comment_reply_bool_exp | null;
  comment_reply_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "comment_reply_reaction"
 */
export interface comment_reply_reaction_insert_input {
  comment_reply?: comment_reply_obj_rel_insert_input | null;
  comment_reply_id?: any | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * on conflict condition type for table "comment_reply_reaction"
 */
export interface comment_reply_reaction_on_conflict {
  constraint: comment_reply_reaction_constraint;
  update_columns: comment_reply_reaction_update_column[];
  where?: comment_reply_reaction_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "contract". All fields are combined with a logical 'AND'.
 */
export interface contract_bool_exp {
  _and?: (contract_bool_exp | null)[] | null;
  _not?: contract_bool_exp | null;
  _or?: (contract_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  deliverables?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member_contracts?: member_contract_bool_exp | null;
  name?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  revocation?: String_comparison_exp | null;
  template?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "contract"
 */
export interface contract_insert_input {
  app_id?: string | null;
  created_at?: any | null;
  deliverables?: string | null;
  description?: string | null;
  id?: any | null;
  member_contracts?: member_contract_arr_rel_insert_input | null;
  name?: string | null;
  options?: any | null;
  published_at?: any | null;
  revocation?: string | null;
  template?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "contract"
 */
export interface contract_obj_rel_insert_input {
  data: contract_insert_input;
  on_conflict?: contract_on_conflict | null;
}

/**
 * on conflict condition type for table "contract"
 */
export interface contract_on_conflict {
  constraint: contract_constraint;
  update_columns: contract_update_column[];
  where?: contract_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "coupon"
 */
export interface coupon_arr_rel_insert_input {
  data: coupon_insert_input[];
  on_conflict?: coupon_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "coupon". All fields are combined with a logical 'AND'.
 */
export interface coupon_bool_exp {
  _and?: (coupon_bool_exp | null)[] | null;
  _not?: coupon_bool_exp | null;
  _or?: (coupon_bool_exp | null)[] | null;
  coupon_code?: coupon_code_bool_exp | null;
  coupon_code_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  order_logs?: order_log_bool_exp | null;
  status?: coupon_status_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "coupon_code"
 */
export interface coupon_code_arr_rel_insert_input {
  data: coupon_code_insert_input[];
  on_conflict?: coupon_code_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "coupon_code". All fields are combined with a logical 'AND'.
 */
export interface coupon_code_bool_exp {
  _and?: (coupon_code_bool_exp | null)[] | null;
  _not?: coupon_code_bool_exp | null;
  _or?: (coupon_code_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  code?: String_comparison_exp | null;
  count?: Int_comparison_exp | null;
  coupon_plan?: coupon_plan_bool_exp | null;
  coupon_plan_id?: uuid_comparison_exp | null;
  coupons?: coupon_bool_exp | null;
  id?: uuid_comparison_exp | null;
  remaining?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "coupon_code"
 */
export interface coupon_code_insert_input {
  app_id?: string | null;
  code?: string | null;
  count?: number | null;
  coupon_plan?: coupon_plan_obj_rel_insert_input | null;
  coupon_plan_id?: any | null;
  coupons?: coupon_arr_rel_insert_input | null;
  id?: any | null;
  remaining?: number | null;
}

/**
 * input type for inserting object relation for remote table "coupon_code"
 */
export interface coupon_code_obj_rel_insert_input {
  data: coupon_code_insert_input;
  on_conflict?: coupon_code_on_conflict | null;
}

/**
 * on conflict condition type for table "coupon_code"
 */
export interface coupon_code_on_conflict {
  constraint: coupon_code_constraint;
  update_columns: coupon_code_update_column[];
  where?: coupon_code_bool_exp | null;
}

/**
 * input type for inserting data into table "coupon"
 */
export interface coupon_insert_input {
  coupon_code?: coupon_code_obj_rel_insert_input | null;
  coupon_code_id?: any | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  order_logs?: order_log_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "coupon"
 */
export interface coupon_obj_rel_insert_input {
  data: coupon_insert_input;
  on_conflict?: coupon_on_conflict | null;
}

/**
 * on conflict condition type for table "coupon"
 */
export interface coupon_on_conflict {
  constraint: coupon_constraint;
  update_columns: coupon_update_column[];
  where?: coupon_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "coupon_plan". All fields are combined with a logical 'AND'.
 */
export interface coupon_plan_bool_exp {
  _and?: (coupon_plan_bool_exp | null)[] | null;
  _not?: coupon_plan_bool_exp | null;
  _or?: (coupon_plan_bool_exp | null)[] | null;
  amount?: numeric_comparison_exp | null;
  constraint?: numeric_comparison_exp | null;
  coupon_codes?: coupon_code_bool_exp | null;
  coupon_plan_products?: coupon_plan_product_bool_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  scope?: jsonb_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  type?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "coupon_plan"
 */
export interface coupon_plan_insert_input {
  amount?: any | null;
  constraint?: any | null;
  coupon_codes?: coupon_code_arr_rel_insert_input | null;
  coupon_plan_products?: coupon_plan_product_arr_rel_insert_input | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  scope?: any | null;
  started_at?: any | null;
  title?: string | null;
  type?: number | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "coupon_plan"
 */
export interface coupon_plan_obj_rel_insert_input {
  data: coupon_plan_insert_input;
  on_conflict?: coupon_plan_on_conflict | null;
}

/**
 * on conflict condition type for table "coupon_plan"
 */
export interface coupon_plan_on_conflict {
  constraint: coupon_plan_constraint;
  update_columns: coupon_plan_update_column[];
  where?: coupon_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "coupon_plan_product"
 */
export interface coupon_plan_product_arr_rel_insert_input {
  data: coupon_plan_product_insert_input[];
  on_conflict?: coupon_plan_product_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "coupon_plan_product". All fields are combined with a logical 'AND'.
 */
export interface coupon_plan_product_bool_exp {
  _and?: (coupon_plan_product_bool_exp | null)[] | null;
  _not?: coupon_plan_product_bool_exp | null;
  _or?: (coupon_plan_product_bool_exp | null)[] | null;
  coupon_plan?: coupon_plan_bool_exp | null;
  coupon_plan_id?: uuid_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "coupon_plan_product"
 */
export interface coupon_plan_product_insert_input {
  coupon_plan?: coupon_plan_obj_rel_insert_input | null;
  coupon_plan_id?: any | null;
  id?: any | null;
  product?: product_obj_rel_insert_input | null;
  product_id?: string | null;
}

/**
 * on conflict condition type for table "coupon_plan_product"
 */
export interface coupon_plan_product_on_conflict {
  constraint: coupon_plan_product_constraint;
  update_columns: coupon_plan_product_update_column[];
  where?: coupon_plan_product_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "coupon_status". All fields are combined with a logical 'AND'.
 */
export interface coupon_status_bool_exp {
  _and?: (coupon_status_bool_exp | null)[] | null;
  _not?: coupon_status_bool_exp | null;
  _or?: (coupon_status_bool_exp | null)[] | null;
  coupon?: coupon_bool_exp | null;
  coupon_id?: uuid_comparison_exp | null;
  outdated?: Boolean_comparison_exp | null;
  used?: Boolean_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "creator". All fields are combined with a logical 'AND'.
 */
export interface creator_bool_exp {
  _and?: (creator_bool_exp | null)[] | null;
  _not?: creator_bool_exp | null;
  _or?: (creator_bool_exp | null)[] | null;
  block_id?: String_comparison_exp | null;
  creator_categories?: creator_category_bool_exp | null;
  id?: String_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_specialities?: member_speciality_bool_exp | null;
  name?: String_comparison_exp | null;
  picture_url?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  published_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "creator_category"
 */
export interface creator_category_arr_rel_insert_input {
  data: creator_category_insert_input[];
  on_conflict?: creator_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "creator_category". All fields are combined with a logical 'AND'.
 */
export interface creator_category_bool_exp {
  _and?: (creator_category_bool_exp | null)[] | null;
  _not?: creator_category_bool_exp | null;
  _or?: (creator_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  creator?: creator_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "creator_category"
 */
export interface creator_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  creator_id?: string | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  position?: number | null;
}

/**
 * on conflict condition type for table "creator_category"
 */
export interface creator_category_on_conflict {
  constraint: creator_category_constraint;
  update_columns: creator_category_update_column[];
  where?: creator_category_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "creator_display"
 */
export interface creator_display_arr_rel_insert_input {
  data: creator_display_insert_input[];
  on_conflict?: creator_display_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "creator_display". All fields are combined with a logical 'AND'.
 */
export interface creator_display_bool_exp {
  _and?: (creator_display_bool_exp | null)[] | null;
  _not?: creator_display_bool_exp | null;
  _or?: (creator_display_bool_exp | null)[] | null;
  block_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "creator_display"
 */
export interface creator_display_insert_input {
  block_id?: string | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  position?: number | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "creator_display"
 */
export interface creator_display_on_conflict {
  constraint: creator_display_constraint;
  update_columns: creator_display_update_column[];
  where?: creator_display_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "currency". All fields are combined with a logical 'AND'.
 */
export interface currency_bool_exp {
  _and?: (currency_bool_exp | null)[] | null;
  _not?: currency_bool_exp | null;
  _or?: (currency_bool_exp | null)[] | null;
  appointment_plans?: appointment_plan_bool_exp | null;
  id?: String_comparison_exp | null;
  label?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  order_products?: order_product_bool_exp | null;
  program_plans?: program_plan_bool_exp | null;
  unit?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "currency"
 */
export interface currency_insert_input {
  appointment_plans?: appointment_plan_arr_rel_insert_input | null;
  id?: string | null;
  label?: string | null;
  name?: string | null;
  order_products?: order_product_arr_rel_insert_input | null;
  program_plans?: program_plan_arr_rel_insert_input | null;
  unit?: string | null;
}

/**
 * input type for inserting object relation for remote table "currency"
 */
export interface currency_obj_rel_insert_input {
  data: currency_insert_input;
  on_conflict?: currency_on_conflict | null;
}

/**
 * on conflict condition type for table "currency"
 */
export interface currency_on_conflict {
  constraint: currency_constraint;
  update_columns: currency_update_column[];
  where?: currency_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "exercise"
 */
export interface exercise_arr_rel_insert_input {
  data: exercise_insert_input[];
  on_conflict?: exercise_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "exercise". All fields are combined with a logical 'AND'.
 */
export interface exercise_bool_exp {
  _and?: (exercise_bool_exp | null)[] | null;
  _not?: exercise_bool_exp | null;
  _or?: (exercise_bool_exp | null)[] | null;
  answer?: jsonb_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  program_content?: program_content_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "exercise"
 */
export interface exercise_insert_input {
  answer?: any | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  program_content?: program_content_obj_rel_insert_input | null;
  program_content_id?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "exercise"
 */
export interface exercise_on_conflict {
  constraint: exercise_constraint;
  update_columns: exercise_update_column[];
  where?: exercise_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "issue"
 */
export interface issue_arr_rel_insert_input {
  data: issue_insert_input[];
  on_conflict?: issue_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "issue". All fields are combined with a logical 'AND'.
 */
export interface issue_bool_exp {
  _and?: (issue_bool_exp | null)[] | null;
  _not?: issue_bool_exp | null;
  _or?: (issue_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  issue_enrollment?: issue_enrollment_bool_exp | null;
  issue_reactions?: issue_reaction_bool_exp | null;
  issue_replies?: issue_reply_bool_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  solved_at?: timestamptz_comparison_exp | null;
  thread_id?: String_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "issue_enrollment". All fields are combined with a logical 'AND'.
 */
export interface issue_enrollment_bool_exp {
  _and?: (issue_enrollment_bool_exp | null)[] | null;
  _not?: issue_enrollment_bool_exp | null;
  _or?: (issue_enrollment_bool_exp | null)[] | null;
  issue?: issue_bool_exp | null;
  issue_id?: uuid_comparison_exp | null;
  program?: program_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  program_content_section_id?: uuid_comparison_exp | null;
  program_id?: uuid_comparison_exp | null;
  program_roles?: program_role_bool_exp | null;
}

/**
 * input type for inserting data into table "issue"
 */
export interface issue_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  created_at?: any | null;
  description?: string | null;
  id?: any | null;
  issue_reactions?: issue_reaction_arr_rel_insert_input | null;
  issue_replies?: issue_reply_arr_rel_insert_input | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  solved_at?: any | null;
  thread_id?: string | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "issue"
 */
export interface issue_obj_rel_insert_input {
  data: issue_insert_input;
  on_conflict?: issue_on_conflict | null;
}

/**
 * on conflict condition type for table "issue"
 */
export interface issue_on_conflict {
  constraint: issue_constraint;
  update_columns: issue_update_column[];
  where?: issue_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "issue_reaction"
 */
export interface issue_reaction_arr_rel_insert_input {
  data: issue_reaction_insert_input[];
  on_conflict?: issue_reaction_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "issue_reaction". All fields are combined with a logical 'AND'.
 */
export interface issue_reaction_bool_exp {
  _and?: (issue_reaction_bool_exp | null)[] | null;
  _not?: issue_reaction_bool_exp | null;
  _or?: (issue_reaction_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  issue?: issue_bool_exp | null;
  issue_id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  public_member?: member_public_bool_exp | null;
}

/**
 * input type for inserting data into table "issue_reaction"
 */
export interface issue_reaction_insert_input {
  created_at?: any | null;
  id?: any | null;
  issue?: issue_obj_rel_insert_input | null;
  issue_id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * on conflict condition type for table "issue_reaction"
 */
export interface issue_reaction_on_conflict {
  constraint: issue_reaction_constraint;
  update_columns: issue_reaction_update_column[];
  where?: issue_reaction_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "issue_reply"
 */
export interface issue_reply_arr_rel_insert_input {
  data: issue_reply_insert_input[];
  on_conflict?: issue_reply_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "issue_reply". All fields are combined with a logical 'AND'.
 */
export interface issue_reply_bool_exp {
  _and?: (issue_reply_bool_exp | null)[] | null;
  _not?: issue_reply_bool_exp | null;
  _or?: (issue_reply_bool_exp | null)[] | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  issue?: issue_bool_exp | null;
  issue_id?: uuid_comparison_exp | null;
  issue_reply_reactions?: issue_reply_reaction_bool_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "issue_reply"
 */
export interface issue_reply_insert_input {
  content?: string | null;
  created_at?: any | null;
  id?: any | null;
  issue?: issue_obj_rel_insert_input | null;
  issue_id?: any | null;
  issue_reply_reactions?: issue_reply_reaction_arr_rel_insert_input | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * input type for inserting object relation for remote table "issue_reply"
 */
export interface issue_reply_obj_rel_insert_input {
  data: issue_reply_insert_input;
  on_conflict?: issue_reply_on_conflict | null;
}

/**
 * on conflict condition type for table "issue_reply"
 */
export interface issue_reply_on_conflict {
  constraint: issue_reply_constraint;
  update_columns: issue_reply_update_column[];
  where?: issue_reply_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "issue_reply_reaction"
 */
export interface issue_reply_reaction_arr_rel_insert_input {
  data: issue_reply_reaction_insert_input[];
  on_conflict?: issue_reply_reaction_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "issue_reply_reaction". All fields are combined with a logical 'AND'.
 */
export interface issue_reply_reaction_bool_exp {
  _and?: (issue_reply_reaction_bool_exp | null)[] | null;
  _not?: issue_reply_reaction_bool_exp | null;
  _or?: (issue_reply_reaction_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  issue_reply?: issue_reply_bool_exp | null;
  issue_reply_id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  public_member?: member_public_bool_exp | null;
}

/**
 * input type for inserting data into table "issue_reply_reaction"
 */
export interface issue_reply_reaction_insert_input {
  created_at?: any | null;
  id?: any | null;
  issue_reply?: issue_reply_obj_rel_insert_input | null;
  issue_reply_id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * on conflict condition type for table "issue_reply_reaction"
 */
export interface issue_reply_reaction_on_conflict {
  constraint: issue_reply_reaction_constraint;
  update_columns: issue_reply_reaction_update_column[];
  where?: issue_reply_reaction_bool_exp | null;
}

/**
 * expression to compare columns of type jsonb. All fields are combined with logical 'AND'.
 */
export interface jsonb_comparison_exp {
  _contained_in?: any | null;
  _contains?: any | null;
  _eq?: any | null;
  _gt?: any | null;
  _gte?: any | null;
  _has_key?: string | null;
  _has_keys_all?: string[] | null;
  _has_keys_any?: string[] | null;
  _in?: any[] | null;
  _is_null?: boolean | null;
  _lt?: any | null;
  _lte?: any | null;
  _neq?: any | null;
  _nin?: any[] | null;
}

/**
 * input type for inserting array relation for remote table "media"
 */
export interface media_arr_rel_insert_input {
  data: media_insert_input[];
  on_conflict?: media_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "media". All fields are combined with a logical 'AND'.
 */
export interface media_bool_exp {
  _and?: (media_bool_exp | null)[] | null;
  _not?: media_bool_exp | null;
  _or?: (media_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  metadata?: jsonb_comparison_exp | null;
  name?: String_comparison_exp | null;
  resource_url?: String_comparison_exp | null;
  size?: Int_comparison_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "media"
 */
export interface media_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  metadata?: any | null;
  name?: string | null;
  resource_url?: string | null;
  size?: number | null;
  type?: string | null;
}

/**
 * on conflict condition type for table "media"
 */
export interface media_on_conflict {
  constraint: media_constraint;
  update_columns: media_update_column[];
  where?: media_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member"
 */
export interface member_arr_rel_insert_input {
  data: member_insert_input[];
  on_conflict?: member_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member". All fields are combined with a logical 'AND'.
 */
export interface member_bool_exp {
  _and?: (member_bool_exp | null)[] | null;
  _not?: member_bool_exp | null;
  _or?: (member_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  activities?: activity_bool_exp | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  appointment_plans?: appointment_plan_bool_exp | null;
  assignRulesBySourceMemberId?: xuemi_assign_rule_bool_exp | null;
  assignRulesByTargetMemberId?: xuemi_assign_rule_bool_exp | null;
  assign_rules?: xuemi_assign_rule_bool_exp | null;
  assigned_at?: timestamptz_comparison_exp | null;
  attends?: attend_bool_exp | null;
  coin_logs?: coin_log_bool_exp | null;
  coin_statuses?: coin_status_bool_exp | null;
  comment_reactions?: comment_reaction_bool_exp | null;
  comment_replies?: comment_reply_bool_exp | null;
  comment_reply_reactions?: comment_reply_reaction_bool_exp | null;
  comments?: comment_bool_exp | null;
  coupons?: coupon_bool_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  creator_categories?: creator_category_bool_exp | null;
  creator_displays?: creator_display_bool_exp | null;
  description?: String_comparison_exp | null;
  email?: String_comparison_exp | null;
  exercises?: exercise_bool_exp | null;
  facebook_user_id?: String_comparison_exp | null;
  google_user_id?: String_comparison_exp | null;
  id?: String_comparison_exp | null;
  issue_reactions?: issue_reaction_bool_exp | null;
  issue_replies?: issue_reply_bool_exp | null;
  issue_reply_reactions?: issue_reply_reaction_bool_exp | null;
  issues?: issue_bool_exp | null;
  line_user_id?: String_comparison_exp | null;
  logined_at?: timestamptz_comparison_exp | null;
  manager?: member_bool_exp | null;
  manager_id?: String_comparison_exp | null;
  media?: media_bool_exp | null;
  memberContractsByAuthorId?: member_contract_bool_exp | null;
  memberNotesByAuthorId?: member_note_bool_exp | null;
  memberTasksByExecutorId?: member_task_bool_exp | null;
  member_cards?: member_card_bool_exp | null;
  member_categories?: member_category_bool_exp | null;
  member_contracts?: member_contract_bool_exp | null;
  member_notes?: member_note_bool_exp | null;
  member_permission_extras?: member_permission_extra_bool_exp | null;
  member_permissions?: member_permission_bool_exp | null;
  member_phones?: member_phone_bool_exp | null;
  member_properties?: member_property_bool_exp | null;
  member_shops?: member_shop_bool_exp | null;
  member_socials?: member_social_bool_exp | null;
  member_specialities?: member_speciality_bool_exp | null;
  member_tags?: member_tag_bool_exp | null;
  member_tasks?: member_task_bool_exp | null;
  members?: member_bool_exp | null;
  merchandises?: merchandise_bool_exp | null;
  metadata?: jsonb_comparison_exp | null;
  name?: String_comparison_exp | null;
  notifications?: notification_bool_exp | null;
  notificationsByTargetMembereId?: notification_bool_exp | null;
  order_contacts?: order_contact_bool_exp | null;
  order_executors?: order_executor_bool_exp | null;
  order_logs?: order_log_bool_exp | null;
  passhash?: String_comparison_exp | null;
  picture_url?: String_comparison_exp | null;
  playlists?: playlist_bool_exp | null;
  podcast_plans?: podcast_plan_bool_exp | null;
  podcast_program_roles?: podcast_program_role_bool_exp | null;
  podcast_programs?: podcast_program_bool_exp | null;
  podcasts?: podcast_bool_exp | null;
  point_logs?: point_log_bool_exp | null;
  point_status?: point_status_bool_exp | null;
  practices?: practice_bool_exp | null;
  program_content_enrollments?: program_content_enrollment_bool_exp | null;
  program_content_progresses?: program_content_progress_bool_exp | null;
  program_roles?: program_role_bool_exp | null;
  program_tempo_deliveries?: program_tempo_delivery_bool_exp | null;
  refresh_token?: uuid_comparison_exp | null;
  reviews?: review_bool_exp | null;
  role?: String_comparison_exp | null;
  roles_deprecated?: jsonb_comparison_exp | null;
  star?: numeric_comparison_exp | null;
  title?: String_comparison_exp | null;
  username?: String_comparison_exp | null;
  vouchers?: voucher_bool_exp | null;
  youtube_channel_ids?: jsonb_comparison_exp | null;
  zoom_user_id_deprecate?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_card"
 */
export interface member_card_arr_rel_insert_input {
  data: member_card_insert_input[];
  on_conflict?: member_card_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_card". All fields are combined with a logical 'AND'.
 */
export interface member_card_bool_exp {
  _and?: (member_card_bool_exp | null)[] | null;
  _not?: member_card_bool_exp | null;
  _or?: (member_card_bool_exp | null)[] | null;
  card_holder?: jsonb_comparison_exp | null;
  card_identifier?: String_comparison_exp | null;
  card_info?: jsonb_comparison_exp | null;
  card_secret?: jsonb_comparison_exp | null;
  id?: String_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_card"
 */
export interface member_card_insert_input {
  card_holder?: any | null;
  card_identifier?: string | null;
  card_info?: any | null;
  card_secret?: any | null;
  id?: string | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
}

/**
 * on conflict condition type for table "member_card"
 */
export interface member_card_on_conflict {
  constraint: member_card_constraint;
  update_columns: member_card_update_column[];
  where?: member_card_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_category"
 */
export interface member_category_arr_rel_insert_input {
  data: member_category_insert_input[];
  on_conflict?: member_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_category". All fields are combined with a logical 'AND'.
 */
export interface member_category_bool_exp {
  _and?: (member_category_bool_exp | null)[] | null;
  _not?: member_category_bool_exp | null;
  _or?: (member_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_category"
 */
export interface member_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  position?: number | null;
}

/**
 * on conflict condition type for table "member_category"
 */
export interface member_category_on_conflict {
  constraint: member_category_constraint;
  update_columns: member_category_update_column[];
  where?: member_category_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_contract"
 */
export interface member_contract_arr_rel_insert_input {
  data: member_contract_insert_input[];
  on_conflict?: member_contract_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_contract". All fields are combined with a logical 'AND'.
 */
export interface member_contract_bool_exp {
  _and?: (member_contract_bool_exp | null)[] | null;
  _not?: member_contract_bool_exp | null;
  _or?: (member_contract_bool_exp | null)[] | null;
  agreed_at?: timestamptz_comparison_exp | null;
  agreed_ip?: String_comparison_exp | null;
  agreed_options?: jsonb_comparison_exp | null;
  author?: member_bool_exp | null;
  author_id?: String_comparison_exp | null;
  contract?: contract_bool_exp | null;
  contract_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  revocation_values?: jsonb_comparison_exp | null;
  revoked_at?: timestamptz_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
  values?: jsonb_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_contract"
 */
export interface member_contract_insert_input {
  agreed_at?: any | null;
  agreed_ip?: string | null;
  agreed_options?: any | null;
  author?: member_obj_rel_insert_input | null;
  author_id?: string | null;
  contract?: contract_obj_rel_insert_input | null;
  contract_id?: any | null;
  created_at?: any | null;
  ended_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  options?: any | null;
  revocation_values?: any | null;
  revoked_at?: any | null;
  started_at?: any | null;
  updated_at?: any | null;
  values?: any | null;
}

/**
 * on conflict condition type for table "member_contract"
 */
export interface member_contract_on_conflict {
  constraint: member_contract_constraint;
  update_columns: member_contract_update_column[];
  where?: member_contract_bool_exp | null;
}

/**
 * input type for inserting data into table "member"
 */
export interface member_insert_input {
  abstract?: string | null;
  activities?: activity_arr_rel_insert_input | null;
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  appointment_plans?: appointment_plan_arr_rel_insert_input | null;
  assignRulesBySourceMemberId?: xuemi_assign_rule_arr_rel_insert_input | null;
  assignRulesByTargetMemberId?: xuemi_assign_rule_arr_rel_insert_input | null;
  assign_rules?: xuemi_assign_rule_arr_rel_insert_input | null;
  assigned_at?: any | null;
  attends?: attend_arr_rel_insert_input | null;
  coin_logs?: coin_log_arr_rel_insert_input | null;
  comment_reactions?: comment_reaction_arr_rel_insert_input | null;
  comment_replies?: comment_reply_arr_rel_insert_input | null;
  comment_reply_reactions?: comment_reply_reaction_arr_rel_insert_input | null;
  comments?: comment_arr_rel_insert_input | null;
  coupons?: coupon_arr_rel_insert_input | null;
  created_at?: any | null;
  creator_categories?: creator_category_arr_rel_insert_input | null;
  creator_displays?: creator_display_arr_rel_insert_input | null;
  description?: string | null;
  email?: string | null;
  exercises?: exercise_arr_rel_insert_input | null;
  facebook_user_id?: string | null;
  google_user_id?: string | null;
  id?: string | null;
  issue_reactions?: issue_reaction_arr_rel_insert_input | null;
  issue_replies?: issue_reply_arr_rel_insert_input | null;
  issue_reply_reactions?: issue_reply_reaction_arr_rel_insert_input | null;
  issues?: issue_arr_rel_insert_input | null;
  line_user_id?: string | null;
  logined_at?: any | null;
  manager?: member_obj_rel_insert_input | null;
  manager_id?: string | null;
  media?: media_arr_rel_insert_input | null;
  memberContractsByAuthorId?: member_contract_arr_rel_insert_input | null;
  memberNotesByAuthorId?: member_note_arr_rel_insert_input | null;
  memberTasksByExecutorId?: member_task_arr_rel_insert_input | null;
  member_cards?: member_card_arr_rel_insert_input | null;
  member_categories?: member_category_arr_rel_insert_input | null;
  member_contracts?: member_contract_arr_rel_insert_input | null;
  member_notes?: member_note_arr_rel_insert_input | null;
  member_permission_extras?: member_permission_extra_arr_rel_insert_input | null;
  member_phones?: member_phone_arr_rel_insert_input | null;
  member_properties?: member_property_arr_rel_insert_input | null;
  member_shops?: member_shop_arr_rel_insert_input | null;
  member_socials?: member_social_arr_rel_insert_input | null;
  member_specialities?: member_speciality_arr_rel_insert_input | null;
  member_tags?: member_tag_arr_rel_insert_input | null;
  member_tasks?: member_task_arr_rel_insert_input | null;
  members?: member_arr_rel_insert_input | null;
  merchandises?: merchandise_arr_rel_insert_input | null;
  metadata?: any | null;
  name?: string | null;
  notifications?: notification_arr_rel_insert_input | null;
  notificationsByTargetMembereId?: notification_arr_rel_insert_input | null;
  order_contacts?: order_contact_arr_rel_insert_input | null;
  order_executors?: order_executor_arr_rel_insert_input | null;
  order_logs?: order_log_arr_rel_insert_input | null;
  passhash?: string | null;
  picture_url?: string | null;
  playlists?: playlist_arr_rel_insert_input | null;
  podcast_plans?: podcast_plan_arr_rel_insert_input | null;
  podcast_program_roles?: podcast_program_role_arr_rel_insert_input | null;
  podcast_programs?: podcast_program_arr_rel_insert_input | null;
  podcasts?: podcast_arr_rel_insert_input | null;
  point_logs?: point_log_arr_rel_insert_input | null;
  practices?: practice_arr_rel_insert_input | null;
  program_content_progresses?: program_content_progress_arr_rel_insert_input | null;
  program_roles?: program_role_arr_rel_insert_input | null;
  program_tempo_deliveries?: program_tempo_delivery_arr_rel_insert_input | null;
  refresh_token?: any | null;
  reviews?: review_arr_rel_insert_input | null;
  role?: string | null;
  roles_deprecated?: any | null;
  star?: any | null;
  title?: string | null;
  username?: string | null;
  vouchers?: voucher_arr_rel_insert_input | null;
  youtube_channel_ids?: any | null;
  zoom_user_id_deprecate?: string | null;
}

/**
 * input type for inserting array relation for remote table "member_note"
 */
export interface member_note_arr_rel_insert_input {
  data: member_note_insert_input[];
  on_conflict?: member_note_on_conflict | null;
}

/**
 * input type for inserting array relation for remote table "member_note_attachment"
 */
export interface member_note_attachment_arr_rel_insert_input {
  data: member_note_attachment_insert_input[];
}

/**
 * Boolean expression to filter rows from the table "member_note_attachment". All fields are combined with a logical 'AND'.
 */
export interface member_note_attachment_bool_exp {
  _and?: (member_note_attachment_bool_exp | null)[] | null;
  _not?: member_note_attachment_bool_exp | null;
  _or?: (member_note_attachment_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  attachment?: attachment_bool_exp | null;
  attachment_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  member_note?: member_note_bool_exp | null;
  member_note_id?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_note_attachment"
 */
export interface member_note_attachment_insert_input {
  app_id?: string | null;
  attachment?: attachment_obj_rel_insert_input | null;
  attachment_id?: any | null;
  created_at?: any | null;
  data?: any | null;
  member_note?: member_note_obj_rel_insert_input | null;
  member_note_id?: string | null;
  options?: any | null;
  updated_at?: any | null;
}

/**
 * Boolean expression to filter rows from the table "member_note". All fields are combined with a logical 'AND'.
 */
export interface member_note_bool_exp {
  _and?: (member_note_bool_exp | null)[] | null;
  _not?: member_note_bool_exp | null;
  _or?: (member_note_bool_exp | null)[] | null;
  author?: member_bool_exp | null;
  author_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  duration?: Int_comparison_exp | null;
  id?: String_comparison_exp | null;
  member?: member_bool_exp | null;
  memberByAuthorId?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  member_note_attachments?: member_note_attachment_bool_exp | null;
  metadata?: jsonb_comparison_exp | null;
  note?: String_comparison_exp | null;
  rejected_at?: timestamptz_comparison_exp | null;
  status?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_note"
 */
export interface member_note_insert_input {
  author?: member_obj_rel_insert_input | null;
  author_id?: string | null;
  created_at?: any | null;
  description?: string | null;
  duration?: number | null;
  id?: string | null;
  member?: member_obj_rel_insert_input | null;
  memberByAuthorId?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  member_note_attachments?: member_note_attachment_arr_rel_insert_input | null;
  metadata?: any | null;
  note?: string | null;
  rejected_at?: any | null;
  status?: string | null;
  type?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "member_note"
 */
export interface member_note_obj_rel_insert_input {
  data: member_note_insert_input;
  on_conflict?: member_note_on_conflict | null;
}

/**
 * on conflict condition type for table "member_note"
 */
export interface member_note_on_conflict {
  constraint: member_note_constraint;
  update_columns: member_note_update_column[];
  where?: member_note_bool_exp | null;
}

/**
 * input type for inserting object relation for remote table "member"
 */
export interface member_obj_rel_insert_input {
  data: member_insert_input;
  on_conflict?: member_on_conflict | null;
}

/**
 * on conflict condition type for table "member"
 */
export interface member_on_conflict {
  constraint: member_constraint;
  update_columns: member_update_column[];
  where?: member_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "member_permission". All fields are combined with a logical 'AND'.
 */
export interface member_permission_bool_exp {
  _and?: (member_permission_bool_exp | null)[] | null;
  _not?: member_permission_bool_exp | null;
  _or?: (member_permission_bool_exp | null)[] | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  permission_id?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_permission_extra"
 */
export interface member_permission_extra_arr_rel_insert_input {
  data: member_permission_extra_insert_input[];
  on_conflict?: member_permission_extra_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_permission_extra". All fields are combined with a logical 'AND'.
 */
export interface member_permission_extra_bool_exp {
  _and?: (member_permission_extra_bool_exp | null)[] | null;
  _not?: member_permission_extra_bool_exp | null;
  _or?: (member_permission_extra_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  permission?: permission_bool_exp | null;
  permission_id?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_permission_extra"
 */
export interface member_permission_extra_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  permission?: permission_obj_rel_insert_input | null;
  permission_id?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "member_permission_extra"
 */
export interface member_permission_extra_on_conflict {
  constraint: member_permission_extra_constraint;
  update_columns: member_permission_extra_update_column[];
  where?: member_permission_extra_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_phone"
 */
export interface member_phone_arr_rel_insert_input {
  data: member_phone_insert_input[];
  on_conflict?: member_phone_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_phone". All fields are combined with a logical 'AND'.
 */
export interface member_phone_bool_exp {
  _and?: (member_phone_bool_exp | null)[] | null;
  _not?: member_phone_bool_exp | null;
  _or?: (member_phone_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_primary?: Boolean_comparison_exp | null;
  is_valid?: Boolean_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  phone?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_phone"
 */
export interface member_phone_insert_input {
  created_at?: any | null;
  id?: any | null;
  is_primary?: boolean | null;
  is_valid?: boolean | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  phone?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "member_phone"
 */
export interface member_phone_on_conflict {
  constraint: member_phone_constraint;
  update_columns: member_phone_update_column[];
  where?: member_phone_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_property"
 */
export interface member_property_arr_rel_insert_input {
  data: member_property_insert_input[];
  on_conflict?: member_property_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_property". All fields are combined with a logical 'AND'.
 */
export interface member_property_bool_exp {
  _and?: (member_property_bool_exp | null)[] | null;
  _not?: member_property_bool_exp | null;
  _or?: (member_property_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  property?: property_bool_exp | null;
  property_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
  value?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_property"
 */
export interface member_property_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  property?: property_obj_rel_insert_input | null;
  property_id?: any | null;
  updated_at?: any | null;
  value?: string | null;
}

/**
 * on conflict condition type for table "member_property"
 */
export interface member_property_on_conflict {
  constraint: member_property_constraint;
  update_columns: member_property_update_column[];
  where?: member_property_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "member_public". All fields are combined with a logical 'AND'.
 */
export interface member_public_bool_exp {
  _and?: (member_public_bool_exp | null)[] | null;
  _not?: member_public_bool_exp | null;
  _or?: (member_public_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  email?: String_comparison_exp | null;
  id?: String_comparison_exp | null;
  member_specialities?: member_speciality_bool_exp | null;
  metadata?: jsonb_comparison_exp | null;
  name?: String_comparison_exp | null;
  picture_url?: String_comparison_exp | null;
  role?: String_comparison_exp | null;
  roles?: jsonb_comparison_exp | null;
  tag_names?: jsonb_comparison_exp | null;
  title?: String_comparison_exp | null;
  username?: String_comparison_exp | null;
  zoom_user_id?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_shop"
 */
export interface member_shop_arr_rel_insert_input {
  data: member_shop_insert_input[];
  on_conflict?: member_shop_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_shop". All fields are combined with a logical 'AND'.
 */
export interface member_shop_bool_exp {
  _and?: (member_shop_bool_exp | null)[] | null;
  _not?: member_shop_bool_exp | null;
  _or?: (member_shop_bool_exp | null)[] | null;
  cover_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  merchandises?: merchandise_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  shipping_methods?: jsonb_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_shop"
 */
export interface member_shop_insert_input {
  cover_url?: string | null;
  created_at?: any | null;
  id?: any | null;
  member_id?: string | null;
  merchandises?: merchandise_arr_rel_insert_input | null;
  published_at?: any | null;
  shipping_methods?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "member_shop"
 */
export interface member_shop_obj_rel_insert_input {
  data: member_shop_insert_input;
  on_conflict?: member_shop_on_conflict | null;
}

/**
 * on conflict condition type for table "member_shop"
 */
export interface member_shop_on_conflict {
  constraint: member_shop_constraint;
  update_columns: member_shop_update_column[];
  where?: member_shop_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_social"
 */
export interface member_social_arr_rel_insert_input {
  data: member_social_insert_input[];
  on_conflict?: member_social_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_social". All fields are combined with a logical 'AND'.
 */
export interface member_social_bool_exp {
  _and?: (member_social_bool_exp | null)[] | null;
  _not?: member_social_bool_exp | null;
  _or?: (member_social_bool_exp | null)[] | null;
  channel_id?: String_comparison_exp | null;
  channel_url?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  profile_url?: String_comparison_exp | null;
  social_cards?: social_card_bool_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_social"
 */
export interface member_social_insert_input {
  channel_id?: string | null;
  channel_url?: string | null;
  description?: string | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  name?: string | null;
  profile_url?: string | null;
  social_cards?: social_card_arr_rel_insert_input | null;
  type?: string | null;
}

/**
 * input type for inserting object relation for remote table "member_social"
 */
export interface member_social_obj_rel_insert_input {
  data: member_social_insert_input;
  on_conflict?: member_social_on_conflict | null;
}

/**
 * on conflict condition type for table "member_social"
 */
export interface member_social_on_conflict {
  constraint: member_social_constraint;
  update_columns: member_social_update_column[];
  where?: member_social_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_speciality"
 */
export interface member_speciality_arr_rel_insert_input {
  data: member_speciality_insert_input[];
  on_conflict?: member_speciality_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_speciality". All fields are combined with a logical 'AND'.
 */
export interface member_speciality_bool_exp {
  _and?: (member_speciality_bool_exp | null)[] | null;
  _not?: member_speciality_bool_exp | null;
  _or?: (member_speciality_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_speciality"
 */
export interface member_speciality_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "member_speciality"
 */
export interface member_speciality_on_conflict {
  constraint: member_speciality_constraint;
  update_columns: member_speciality_update_column[];
  where?: member_speciality_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_tag"
 */
export interface member_tag_arr_rel_insert_input {
  data: member_tag_insert_input[];
  on_conflict?: member_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_tag". All fields are combined with a logical 'AND'.
 */
export interface member_tag_bool_exp {
  _and?: (member_tag_bool_exp | null)[] | null;
  _not?: member_tag_bool_exp | null;
  _or?: (member_tag_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_tag"
 */
export interface member_tag_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "member_tag"
 */
export interface member_tag_on_conflict {
  constraint: member_tag_constraint;
  update_columns: member_tag_update_column[];
  where?: member_tag_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "member_task"
 */
export interface member_task_arr_rel_insert_input {
  data: member_task_insert_input[];
  on_conflict?: member_task_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "member_task". All fields are combined with a logical 'AND'.
 */
export interface member_task_bool_exp {
  _and?: (member_task_bool_exp | null)[] | null;
  _not?: member_task_bool_exp | null;
  _or?: (member_task_bool_exp | null)[] | null;
  author?: member_bool_exp | null;
  author_id?: String_comparison_exp | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  due_at?: timestamptz_comparison_exp | null;
  executor?: member_bool_exp | null;
  executor_id?: String_comparison_exp | null;
  id?: String_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  priority?: String_comparison_exp | null;
  status?: String_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "member_task"
 */
export interface member_task_insert_input {
  author?: member_obj_rel_insert_input | null;
  author_id?: string | null;
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  created_at?: any | null;
  description?: string | null;
  due_at?: any | null;
  executor?: member_obj_rel_insert_input | null;
  executor_id?: string | null;
  id?: string | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  priority?: string | null;
  status?: string | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "member_task"
 */
export interface member_task_on_conflict {
  constraint: member_task_constraint;
  update_columns: member_task_update_column[];
  where?: member_task_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise"
 */
export interface merchandise_arr_rel_insert_input {
  data: merchandise_insert_input[];
  on_conflict?: merchandise_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise". All fields are combined with a logical 'AND'.
 */
export interface merchandise_bool_exp {
  _and?: (merchandise_bool_exp | null)[] | null;
  _not?: merchandise_bool_exp | null;
  _or?: (merchandise_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_countdown_timer_visible?: Boolean_comparison_exp | null;
  is_customized?: Boolean_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  is_limited?: Boolean_comparison_exp | null;
  is_physical?: Boolean_comparison_exp | null;
  link?: String_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  member_shop?: member_shop_bool_exp | null;
  member_shop_id?: uuid_comparison_exp | null;
  merchandise_categories?: merchandise_category_bool_exp | null;
  merchandise_files?: merchandise_file_bool_exp | null;
  merchandise_imgs?: merchandise_img_bool_exp | null;
  merchandise_inventory_status?: merchandise_inventory_status_bool_exp | null;
  merchandise_specs?: merchandise_spec_bool_exp | null;
  merchandise_tags?: merchandise_tag_bool_exp | null;
  meta?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  post_merchandises?: post_merchandise_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise_category"
 */
export interface merchandise_category_arr_rel_insert_input {
  data: merchandise_category_insert_input[];
  on_conflict?: merchandise_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_category". All fields are combined with a logical 'AND'.
 */
export interface merchandise_category_bool_exp {
  _and?: (merchandise_category_bool_exp | null)[] | null;
  _not?: merchandise_category_bool_exp | null;
  _or?: (merchandise_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "merchandise_category"
 */
export interface merchandise_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  merchandise?: merchandise_obj_rel_insert_input | null;
  merchandise_id?: any | null;
  position?: number | null;
}

/**
 * on conflict condition type for table "merchandise_category"
 */
export interface merchandise_category_on_conflict {
  constraint: merchandise_category_constraint;
  update_columns: merchandise_category_update_column[];
  where?: merchandise_category_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise_file"
 */
export interface merchandise_file_arr_rel_insert_input {
  data: merchandise_file_insert_input[];
  on_conflict?: merchandise_file_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_file". All fields are combined with a logical 'AND'.
 */
export interface merchandise_file_bool_exp {
  _and?: (merchandise_file_bool_exp | null)[] | null;
  _not?: merchandise_file_bool_exp | null;
  _or?: (merchandise_file_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "merchandise_file"
 */
export interface merchandise_file_insert_input {
  created_at?: any | null;
  data?: any | null;
  id?: any | null;
  merchandise?: merchandise_obj_rel_insert_input | null;
  merchandise_id?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "merchandise_file"
 */
export interface merchandise_file_on_conflict {
  constraint: merchandise_file_constraint;
  update_columns: merchandise_file_update_column[];
  where?: merchandise_file_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise_img"
 */
export interface merchandise_img_arr_rel_insert_input {
  data: merchandise_img_insert_input[];
  on_conflict?: merchandise_img_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_img". All fields are combined with a logical 'AND'.
 */
export interface merchandise_img_bool_exp {
  _and?: (merchandise_img_bool_exp | null)[] | null;
  _not?: merchandise_img_bool_exp | null;
  _or?: (merchandise_img_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  type?: String_comparison_exp | null;
  url?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "merchandise_img"
 */
export interface merchandise_img_insert_input {
  id?: any | null;
  merchandise?: merchandise_obj_rel_insert_input | null;
  merchandise_id?: any | null;
  position?: number | null;
  type?: string | null;
  url?: string | null;
}

/**
 * on conflict condition type for table "merchandise_img"
 */
export interface merchandise_img_on_conflict {
  constraint: merchandise_img_constraint;
  update_columns: merchandise_img_update_column[];
  where?: merchandise_img_bool_exp | null;
}

/**
 * input type for inserting data into table "merchandise"
 */
export interface merchandise_insert_input {
  abstract?: string | null;
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  created_at?: any | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  is_countdown_timer_visible?: boolean | null;
  is_customized?: boolean | null;
  is_deleted?: boolean | null;
  is_limited?: boolean | null;
  is_physical?: boolean | null;
  link?: string | null;
  list_price?: any | null;
  member_id?: string | null;
  member_shop?: member_shop_obj_rel_insert_input | null;
  member_shop_id?: any | null;
  merchandise_categories?: merchandise_category_arr_rel_insert_input | null;
  merchandise_files?: merchandise_file_arr_rel_insert_input | null;
  merchandise_imgs?: merchandise_img_arr_rel_insert_input | null;
  merchandise_specs?: merchandise_spec_arr_rel_insert_input | null;
  merchandise_tags?: merchandise_tag_arr_rel_insert_input | null;
  meta?: string | null;
  position?: number | null;
  post_merchandises?: post_merchandise_arr_rel_insert_input | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  started_at?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface merchandise_inventory_status_bool_exp {
  _and?: (merchandise_inventory_status_bool_exp | null)[] | null;
  _not?: merchandise_inventory_status_bool_exp | null;
  _or?: (merchandise_inventory_status_bool_exp | null)[] | null;
  buyable_quantity?: bigint_comparison_exp | null;
  delivered_quantity?: bigint_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  total_quantity?: bigint_comparison_exp | null;
  undelivered_quantity?: bigint_comparison_exp | null;
}

/**
 * input type for inserting object relation for remote table "merchandise"
 */
export interface merchandise_obj_rel_insert_input {
  data: merchandise_insert_input;
  on_conflict?: merchandise_on_conflict | null;
}

/**
 * on conflict condition type for table "merchandise"
 */
export interface merchandise_on_conflict {
  constraint: merchandise_constraint;
  update_columns: merchandise_update_column[];
  where?: merchandise_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise_spec"
 */
export interface merchandise_spec_arr_rel_insert_input {
  data: merchandise_spec_insert_input[];
  on_conflict?: merchandise_spec_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_spec". All fields are combined with a logical 'AND'.
 */
export interface merchandise_spec_bool_exp {
  _and?: (merchandise_spec_bool_exp | null)[] | null;
  _not?: merchandise_spec_bool_exp | null;
  _or?: (merchandise_spec_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  merchandise_spec_files?: merchandise_spec_file_bool_exp | null;
  merchandise_spec_inventory_status?: merchandise_spec_inventory_status_bool_exp | null;
  quota?: Int_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise_spec_file"
 */
export interface merchandise_spec_file_arr_rel_insert_input {
  data: merchandise_spec_file_insert_input[];
  on_conflict?: merchandise_spec_file_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_spec_file". All fields are combined with a logical 'AND'.
 */
export interface merchandise_spec_file_bool_exp {
  _and?: (merchandise_spec_file_bool_exp | null)[] | null;
  _not?: merchandise_spec_file_bool_exp | null;
  _or?: (merchandise_spec_file_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  merchandise_spec?: merchandise_spec_bool_exp | null;
  merchandise_spec_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "merchandise_spec_file"
 */
export interface merchandise_spec_file_insert_input {
  created_at?: any | null;
  data?: any | null;
  id?: any | null;
  merchandise_spec?: merchandise_spec_obj_rel_insert_input | null;
  merchandise_spec_id?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "merchandise_spec_file"
 */
export interface merchandise_spec_file_on_conflict {
  constraint: merchandise_spec_file_constraint;
  update_columns: merchandise_spec_file_update_column[];
  where?: merchandise_spec_file_bool_exp | null;
}

/**
 * input type for inserting data into table "merchandise_spec"
 */
export interface merchandise_spec_insert_input {
  created_at?: any | null;
  id?: any | null;
  is_deleted?: boolean | null;
  list_price?: any | null;
  merchandise?: merchandise_obj_rel_insert_input | null;
  merchandise_id?: any | null;
  merchandise_spec_files?: merchandise_spec_file_arr_rel_insert_input | null;
  quota?: number | null;
  sale_price?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_spec_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface merchandise_spec_inventory_status_bool_exp {
  _and?: (merchandise_spec_inventory_status_bool_exp | null)[] | null;
  _not?: merchandise_spec_inventory_status_bool_exp | null;
  _or?: (merchandise_spec_inventory_status_bool_exp | null)[] | null;
  buyable_quantity?: bigint_comparison_exp | null;
  delivered_quantity?: bigint_comparison_exp | null;
  merchandise_spec?: merchandise_spec_bool_exp | null;
  merchandise_spec_id?: uuid_comparison_exp | null;
  total_quantity?: bigint_comparison_exp | null;
  undelivered_quantity?: bigint_comparison_exp | null;
}

/**
 * input type for inserting object relation for remote table "merchandise_spec"
 */
export interface merchandise_spec_obj_rel_insert_input {
  data: merchandise_spec_insert_input;
  on_conflict?: merchandise_spec_on_conflict | null;
}

/**
 * on conflict condition type for table "merchandise_spec"
 */
export interface merchandise_spec_on_conflict {
  constraint: merchandise_spec_constraint;
  update_columns: merchandise_spec_update_column[];
  where?: merchandise_spec_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "merchandise_tag"
 */
export interface merchandise_tag_arr_rel_insert_input {
  data: merchandise_tag_insert_input[];
  on_conflict?: merchandise_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "merchandise_tag". All fields are combined with a logical 'AND'.
 */
export interface merchandise_tag_bool_exp {
  _and?: (merchandise_tag_bool_exp | null)[] | null;
  _not?: merchandise_tag_bool_exp | null;
  _or?: (merchandise_tag_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "merchandise_tag"
 */
export interface merchandise_tag_insert_input {
  id?: any | null;
  merchandise?: merchandise_obj_rel_insert_input | null;
  merchandise_id?: any | null;
  position?: number | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
}

/**
 * on conflict condition type for table "merchandise_tag"
 */
export interface merchandise_tag_on_conflict {
  constraint: merchandise_tag_constraint;
  update_columns: merchandise_tag_update_column[];
  where?: merchandise_tag_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "module". All fields are combined with a logical 'AND'.
 */
export interface module_bool_exp {
  _and?: (module_bool_exp | null)[] | null;
  _not?: module_bool_exp | null;
  _or?: (module_bool_exp | null)[] | null;
  app_modules?: app_module_bool_exp | null;
  id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "module"
 */
export interface module_insert_input {
  app_modules?: app_module_arr_rel_insert_input | null;
  id?: string | null;
  name?: string | null;
}

/**
 * input type for inserting object relation for remote table "module"
 */
export interface module_obj_rel_insert_input {
  data: module_insert_input;
  on_conflict?: module_on_conflict | null;
}

/**
 * on conflict condition type for table "module"
 */
export interface module_on_conflict {
  constraint: module_constraint;
  update_columns: module_update_column[];
  where?: module_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "notification"
 */
export interface notification_arr_rel_insert_input {
  data: notification_insert_input[];
  on_conflict?: notification_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "notification". All fields are combined with a logical 'AND'.
 */
export interface notification_bool_exp {
  _and?: (notification_bool_exp | null)[] | null;
  _not?: notification_bool_exp | null;
  _or?: (notification_bool_exp | null)[] | null;
  avatar?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  extra?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  read_at?: timestamptz_comparison_exp | null;
  reference_url?: String_comparison_exp | null;
  sourceMember?: member_bool_exp | null;
  source_member_id?: String_comparison_exp | null;
  targetMember?: member_bool_exp | null;
  target_member_id?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "notification"
 */
export interface notification_insert_input {
  avatar?: string | null;
  created_at?: any | null;
  description?: string | null;
  extra?: string | null;
  id?: any | null;
  read_at?: any | null;
  reference_url?: string | null;
  sourceMember?: member_obj_rel_insert_input | null;
  source_member_id?: string | null;
  targetMember?: member_obj_rel_insert_input | null;
  target_member_id?: string | null;
  type?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "notification"
 */
export interface notification_on_conflict {
  constraint: notification_constraint;
  update_columns: notification_update_column[];
  where?: notification_bool_exp | null;
}

/**
 * expression to compare columns of type numeric. All fields are combined with logical 'AND'.
 */
export interface numeric_comparison_exp {
  _eq?: any | null;
  _gt?: any | null;
  _gte?: any | null;
  _in?: any[] | null;
  _is_null?: boolean | null;
  _lt?: any | null;
  _lte?: any | null;
  _neq?: any | null;
  _nin?: any[] | null;
}

/**
 * input type for inserting array relation for remote table "order_contact"
 */
export interface order_contact_arr_rel_insert_input {
  data: order_contact_insert_input[];
  on_conflict?: order_contact_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "order_contact". All fields are combined with a logical 'AND'.
 */
export interface order_contact_bool_exp {
  _and?: (order_contact_bool_exp | null)[] | null;
  _not?: order_contact_bool_exp | null;
  _or?: (order_contact_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  message?: String_comparison_exp | null;
  order_id?: String_comparison_exp | null;
  order_log?: order_log_bool_exp | null;
  read_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "order_contact"
 */
export interface order_contact_insert_input {
  created_at?: any | null;
  id?: any | null;
  member_id?: string | null;
  message?: string | null;
  order_id?: string | null;
  order_log?: order_log_obj_rel_insert_input | null;
  read_at?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "order_contact"
 */
export interface order_contact_on_conflict {
  constraint: order_contact_constraint;
  update_columns: order_contact_update_column[];
  where?: order_contact_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "order_discount"
 */
export interface order_discount_arr_rel_insert_input {
  data: order_discount_insert_input[];
  on_conflict?: order_discount_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "order_discount". All fields are combined with a logical 'AND'.
 */
export interface order_discount_bool_exp {
  _and?: (order_discount_bool_exp | null)[] | null;
  _not?: order_discount_bool_exp | null;
  _or?: (order_discount_bool_exp | null)[] | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  name?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  order_id?: String_comparison_exp | null;
  order_log?: order_log_bool_exp | null;
  price?: numeric_comparison_exp | null;
  target?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "order_discount"
 */
export interface order_discount_insert_input {
  description?: string | null;
  id?: any | null;
  name?: string | null;
  options?: any | null;
  order_id?: string | null;
  order_log?: order_log_obj_rel_insert_input | null;
  price?: any | null;
  target?: string | null;
  type?: string | null;
}

/**
 * on conflict condition type for table "order_discount"
 */
export interface order_discount_on_conflict {
  constraint: order_discount_constraint;
  update_columns: order_discount_update_column[];
  where?: order_discount_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "order_executor"
 */
export interface order_executor_arr_rel_insert_input {
  data: order_executor_insert_input[];
  on_conflict?: order_executor_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "order_executor". All fields are combined with a logical 'AND'.
 */
export interface order_executor_bool_exp {
  _and?: (order_executor_bool_exp | null)[] | null;
  _not?: order_executor_bool_exp | null;
  _or?: (order_executor_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  order_id?: String_comparison_exp | null;
  order_log?: order_log_bool_exp | null;
  ratio?: numeric_comparison_exp | null;
}

/**
 * input type for inserting data into table "order_executor"
 */
export interface order_executor_insert_input {
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  order_id?: string | null;
  order_log?: order_log_obj_rel_insert_input | null;
  ratio?: any | null;
}

/**
 * on conflict condition type for table "order_executor"
 */
export interface order_executor_on_conflict {
  constraint: order_executor_constraint;
  update_columns: order_executor_update_column[];
  where?: order_executor_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "order_log"
 */
export interface order_log_arr_rel_insert_input {
  data: order_log_insert_input[];
  on_conflict?: order_log_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "order_log". All fields are combined with a logical 'AND'.
 */
export interface order_log_bool_exp {
  _and?: (order_log_bool_exp | null)[] | null;
  _not?: order_log_bool_exp | null;
  _or?: (order_log_bool_exp | null)[] | null;
  auto_renewed_at?: timestamptz_comparison_exp | null;
  coupon?: coupon_bool_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  deliver_message?: String_comparison_exp | null;
  delivered_at?: timestamptz_comparison_exp | null;
  discount_coupon_id?: uuid_comparison_exp | null;
  discount_point?: numeric_comparison_exp | null;
  discount_price?: numeric_comparison_exp | null;
  discount_type?: Int_comparison_exp | null;
  expired_at?: timestamptz_comparison_exp | null;
  id?: String_comparison_exp | null;
  invoice?: jsonb_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  last_paid_at?: timestamptz_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  message?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  order_contacts?: order_contact_bool_exp | null;
  order_discounts?: order_discount_bool_exp | null;
  order_executors?: order_executor_bool_exp | null;
  order_products?: order_product_bool_exp | null;
  parent_order_id?: String_comparison_exp | null;
  parent_order_log?: order_log_bool_exp | null;
  payment_logs?: payment_log_bool_exp | null;
  payment_model?: jsonb_comparison_exp | null;
  retried_at?: timestamptz_comparison_exp | null;
  shipping?: jsonb_comparison_exp | null;
  status?: String_comparison_exp | null;
  sub_order_logs?: order_log_bool_exp | null;
  transferred_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "order_log"
 */
export interface order_log_insert_input {
  auto_renewed_at?: any | null;
  coupon?: coupon_obj_rel_insert_input | null;
  created_at?: any | null;
  deliver_message?: string | null;
  delivered_at?: any | null;
  discount_coupon_id?: any | null;
  discount_point?: any | null;
  discount_price?: any | null;
  discount_type?: number | null;
  expired_at?: any | null;
  id?: string | null;
  invoice?: any | null;
  is_deleted?: boolean | null;
  last_paid_at?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  message?: string | null;
  options?: any | null;
  order_contacts?: order_contact_arr_rel_insert_input | null;
  order_discounts?: order_discount_arr_rel_insert_input | null;
  order_executors?: order_executor_arr_rel_insert_input | null;
  order_products?: order_product_arr_rel_insert_input | null;
  parent_order_id?: string | null;
  parent_order_log?: order_log_obj_rel_insert_input | null;
  payment_logs?: payment_log_arr_rel_insert_input | null;
  payment_model?: any | null;
  retried_at?: any | null;
  shipping?: any | null;
  status?: string | null;
  sub_order_logs?: order_log_arr_rel_insert_input | null;
  transferred_at?: any | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "order_log"
 */
export interface order_log_obj_rel_insert_input {
  data: order_log_insert_input;
  on_conflict?: order_log_on_conflict | null;
}

/**
 * on conflict condition type for table "order_log"
 */
export interface order_log_on_conflict {
  constraint: order_log_constraint;
  update_columns: order_log_update_column[];
  where?: order_log_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "order_payment_status". All fields are combined with a logical 'AND'.
 */
export interface order_payment_status_bool_exp {
  _and?: (order_payment_status_bool_exp | null)[] | null;
  _not?: order_payment_status_bool_exp | null;
  _or?: (order_payment_status_bool_exp | null)[] | null;
  last_paid_at?: timestamptz_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  order_id?: String_comparison_exp | null;
  order_log?: order_log_bool_exp | null;
  status?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "order_product"
 */
export interface order_product_arr_rel_insert_input {
  data: order_product_insert_input[];
  on_conflict?: order_product_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "order_product". All fields are combined with a logical 'AND'.
 */
export interface order_product_bool_exp {
  _and?: (order_product_bool_exp | null)[] | null;
  _not?: order_product_bool_exp | null;
  _or?: (order_product_bool_exp | null)[] | null;
  accumulated_errors?: Int_comparison_exp | null;
  activity_attendances?: activity_attendance_bool_exp | null;
  auto_renewed?: Boolean_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  currency?: currency_bool_exp | null;
  currency_id?: String_comparison_exp | null;
  deliverables?: jsonb_comparison_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  name?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  order_id?: String_comparison_exp | null;
  order_log?: order_log_bool_exp | null;
  order_product_files?: order_product_file_bool_exp | null;
  price?: numeric_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "order_product_file"
 */
export interface order_product_file_arr_rel_insert_input {
  data: order_product_file_insert_input[];
  on_conflict?: order_product_file_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "order_product_file". All fields are combined with a logical 'AND'.
 */
export interface order_product_file_bool_exp {
  _and?: (order_product_file_bool_exp | null)[] | null;
  _not?: order_product_file_bool_exp | null;
  _or?: (order_product_file_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  order_product?: order_product_bool_exp | null;
  order_product_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "order_product_file"
 */
export interface order_product_file_insert_input {
  created_at?: any | null;
  data?: any | null;
  id?: any | null;
  order_product?: order_product_obj_rel_insert_input | null;
  order_product_id?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "order_product_file"
 */
export interface order_product_file_on_conflict {
  constraint: order_product_file_constraint;
  update_columns: order_product_file_update_column[];
  where?: order_product_file_bool_exp | null;
}

/**
 * input type for inserting data into table "order_product"
 */
export interface order_product_insert_input {
  accumulated_errors?: number | null;
  activity_attendances?: activity_attendance_arr_rel_insert_input | null;
  auto_renewed?: boolean | null;
  created_at?: any | null;
  currency?: currency_obj_rel_insert_input | null;
  currency_id?: string | null;
  deliverables?: any | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  name?: string | null;
  options?: any | null;
  order_id?: string | null;
  order_log?: order_log_obj_rel_insert_input | null;
  order_product_files?: order_product_file_arr_rel_insert_input | null;
  price?: any | null;
  product?: product_obj_rel_insert_input | null;
  product_id?: string | null;
  started_at?: any | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "order_product"
 */
export interface order_product_obj_rel_insert_input {
  data: order_product_insert_input;
  on_conflict?: order_product_on_conflict | null;
}

/**
 * on conflict condition type for table "order_product"
 */
export interface order_product_on_conflict {
  constraint: order_product_constraint;
  update_columns: order_product_update_column[];
  where?: order_product_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "package"
 */
export interface package_arr_rel_insert_input {
  data: package_insert_input[];
  on_conflict?: package_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "package". All fields are combined with a logical 'AND'.
 */
export interface package_bool_exp {
  _and?: (package_bool_exp | null)[] | null;
  _not?: package_bool_exp | null;
  _or?: (package_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  elements?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  package_sections?: package_section_bool_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "package"
 */
export interface package_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  elements?: any | null;
  id?: any | null;
  package_sections?: package_section_arr_rel_insert_input | null;
  title?: string | null;
}

/**
 * input type for inserting array relation for remote table "package_item"
 */
export interface package_item_arr_rel_insert_input {
  data: package_item_insert_input[];
  on_conflict?: package_item_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "package_item". All fields are combined with a logical 'AND'.
 */
export interface package_item_bool_exp {
  _and?: (package_item_bool_exp | null)[] | null;
  _not?: package_item_bool_exp | null;
  _or?: (package_item_bool_exp | null)[] | null;
  activity?: activity_bool_exp | null;
  activity_id?: uuid_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  package_item_group?: package_item_group_bool_exp | null;
  package_item_group_id?: uuid_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "package_item_group"
 */
export interface package_item_group_arr_rel_insert_input {
  data: package_item_group_insert_input[];
  on_conflict?: package_item_group_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "package_item_group". All fields are combined with a logical 'AND'.
 */
export interface package_item_group_bool_exp {
  _and?: (package_item_group_bool_exp | null)[] | null;
  _not?: package_item_group_bool_exp | null;
  _or?: (package_item_group_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  package_items?: package_item_bool_exp | null;
  package_section?: package_section_bool_exp | null;
  package_section_id?: uuid_comparison_exp | null;
  subtitle?: String_comparison_exp | null;
  title?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
  with_filter?: Boolean_comparison_exp | null;
}

/**
 * input type for inserting data into table "package_item_group"
 */
export interface package_item_group_insert_input {
  id?: any | null;
  package_items?: package_item_arr_rel_insert_input | null;
  package_section?: package_section_obj_rel_insert_input | null;
  package_section_id?: any | null;
  subtitle?: string | null;
  title?: string | null;
  type?: string | null;
  with_filter?: boolean | null;
}

/**
 * input type for inserting object relation for remote table "package_item_group"
 */
export interface package_item_group_obj_rel_insert_input {
  data: package_item_group_insert_input;
  on_conflict?: package_item_group_on_conflict | null;
}

/**
 * on conflict condition type for table "package_item_group"
 */
export interface package_item_group_on_conflict {
  constraint: package_item_group_constraint;
  update_columns: package_item_group_update_column[];
  where?: package_item_group_bool_exp | null;
}

/**
 * input type for inserting data into table "package_item"
 */
export interface package_item_insert_input {
  activity?: activity_obj_rel_insert_input | null;
  activity_id?: any | null;
  id?: any | null;
  merchandise_id?: any | null;
  package_item_group?: package_item_group_obj_rel_insert_input | null;
  package_item_group_id?: any | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
}

/**
 * on conflict condition type for table "package_item"
 */
export interface package_item_on_conflict {
  constraint: package_item_constraint;
  update_columns: package_item_update_column[];
  where?: package_item_bool_exp | null;
}

/**
 * input type for inserting object relation for remote table "package"
 */
export interface package_obj_rel_insert_input {
  data: package_insert_input;
  on_conflict?: package_on_conflict | null;
}

/**
 * on conflict condition type for table "package"
 */
export interface package_on_conflict {
  constraint: package_constraint;
  update_columns: package_update_column[];
  where?: package_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "package_section"
 */
export interface package_section_arr_rel_insert_input {
  data: package_section_insert_input[];
  on_conflict?: package_section_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "package_section". All fields are combined with a logical 'AND'.
 */
export interface package_section_bool_exp {
  _and?: (package_section_bool_exp | null)[] | null;
  _not?: package_section_bool_exp | null;
  _or?: (package_section_bool_exp | null)[] | null;
  block?: Boolean_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  package?: package_bool_exp | null;
  package_id?: uuid_comparison_exp | null;
  package_item_groups?: package_item_group_bool_exp | null;
  position?: Int_comparison_exp | null;
  subtitle?: String_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "package_section"
 */
export interface package_section_insert_input {
  block?: boolean | null;
  description?: string | null;
  id?: any | null;
  package?: package_obj_rel_insert_input | null;
  package_id?: any | null;
  package_item_groups?: package_item_group_arr_rel_insert_input | null;
  position?: number | null;
  subtitle?: string | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "package_section"
 */
export interface package_section_obj_rel_insert_input {
  data: package_section_insert_input;
  on_conflict?: package_section_on_conflict | null;
}

/**
 * on conflict condition type for table "package_section"
 */
export interface package_section_on_conflict {
  constraint: package_section_constraint;
  update_columns: package_section_update_column[];
  where?: package_section_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "payment_log"
 */
export interface payment_log_arr_rel_insert_input {
  data: payment_log_insert_input[];
  on_conflict?: payment_log_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "payment_log". All fields are combined with a logical 'AND'.
 */
export interface payment_log_bool_exp {
  _and?: (payment_log_bool_exp | null)[] | null;
  _not?: payment_log_bool_exp | null;
  _or?: (payment_log_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  gateway?: String_comparison_exp | null;
  method?: String_comparison_exp | null;
  no?: numeric_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  order_id?: String_comparison_exp | null;
  order_log?: order_log_bool_exp | null;
  order_payment_status?: order_payment_status_bool_exp | null;
  paid_at?: timestamptz_comparison_exp | null;
  payment_due_at?: timestamptz_comparison_exp | null;
  price?: numeric_comparison_exp | null;
  status?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "payment_log"
 */
export interface payment_log_insert_input {
  created_at?: any | null;
  gateway?: string | null;
  method?: string | null;
  no?: any | null;
  options?: any | null;
  order_id?: string | null;
  order_log?: order_log_obj_rel_insert_input | null;
  paid_at?: any | null;
  payment_due_at?: any | null;
  price?: any | null;
  status?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "payment_log"
 */
export interface payment_log_on_conflict {
  constraint: payment_log_constraint;
  update_columns: payment_log_update_column[];
  where?: payment_log_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "permission". All fields are combined with a logical 'AND'.
 */
export interface permission_bool_exp {
  _and?: (permission_bool_exp | null)[] | null;
  _not?: permission_bool_exp | null;
  _or?: (permission_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  group?: String_comparison_exp | null;
  id?: String_comparison_exp | null;
  member_permission_extras?: member_permission_extra_bool_exp | null;
  role_permissions?: role_permission_bool_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "permission"
 */
export interface permission_insert_input {
  created_at?: any | null;
  description?: string | null;
  group?: string | null;
  id?: string | null;
  member_permission_extras?: member_permission_extra_arr_rel_insert_input | null;
  role_permissions?: role_permission_arr_rel_insert_input | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "permission"
 */
export interface permission_obj_rel_insert_input {
  data: permission_insert_input;
  on_conflict?: permission_on_conflict | null;
}

/**
 * on conflict condition type for table "permission"
 */
export interface permission_on_conflict {
  constraint: permission_constraint;
  update_columns: permission_update_column[];
  where?: permission_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "playlist"
 */
export interface playlist_arr_rel_insert_input {
  data: playlist_insert_input[];
  on_conflict?: playlist_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "playlist". All fields are combined with a logical 'AND'.
 */
export interface playlist_bool_exp {
  _and?: (playlist_bool_exp | null)[] | null;
  _not?: playlist_bool_exp | null;
  _or?: (playlist_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  playlist_podcast_programs?: playlist_podcast_program_bool_exp | null;
  position?: Int_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "playlist"
 */
export interface playlist_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  playlist_podcast_programs?: playlist_podcast_program_arr_rel_insert_input | null;
  position?: number | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "playlist"
 */
export interface playlist_obj_rel_insert_input {
  data: playlist_insert_input;
  on_conflict?: playlist_on_conflict | null;
}

/**
 * on conflict condition type for table "playlist"
 */
export interface playlist_on_conflict {
  constraint: playlist_constraint;
  update_columns: playlist_update_column[];
  where?: playlist_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "playlist_podcast_program"
 */
export interface playlist_podcast_program_arr_rel_insert_input {
  data: playlist_podcast_program_insert_input[];
  on_conflict?: playlist_podcast_program_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "playlist_podcast_program". All fields are combined with a logical 'AND'.
 */
export interface playlist_podcast_program_bool_exp {
  _and?: (playlist_podcast_program_bool_exp | null)[] | null;
  _not?: playlist_podcast_program_bool_exp | null;
  _or?: (playlist_podcast_program_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  playlist?: playlist_bool_exp | null;
  playlist_id?: uuid_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "playlist_podcast_program"
 */
export interface playlist_podcast_program_insert_input {
  created_at?: any | null;
  id?: any | null;
  playlist?: playlist_obj_rel_insert_input | null;
  playlist_id?: any | null;
  podcast_program?: podcast_program_obj_rel_insert_input | null;
  podcast_program_id?: any | null;
  position?: number | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "playlist_podcast_program"
 */
export interface playlist_podcast_program_on_conflict {
  constraint: playlist_podcast_program_constraint;
  update_columns: playlist_podcast_program_update_column[];
  where?: playlist_podcast_program_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast"
 */
export interface podcast_arr_rel_insert_input {
  data: podcast_insert_input[];
  on_conflict?: podcast_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast". All fields are combined with a logical 'AND'.
 */
export interface podcast_bool_exp {
  _and?: (podcast_bool_exp | null)[] | null;
  _not?: podcast_bool_exp | null;
  _or?: (podcast_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  instructor_id?: String_comparison_exp | null;
  member?: member_bool_exp | null;
  podcast_plans?: podcast_plan_bool_exp | null;
  podcast_programs?: podcast_program_bool_exp | null;
}

/**
 * input type for inserting data into table "podcast"
 */
export interface podcast_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  id?: any | null;
  instructor_id?: string | null;
  member?: member_obj_rel_insert_input | null;
  podcast_plans?: podcast_plan_arr_rel_insert_input | null;
  podcast_programs?: podcast_program_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "podcast"
 */
export interface podcast_obj_rel_insert_input {
  data: podcast_insert_input;
  on_conflict?: podcast_on_conflict | null;
}

/**
 * on conflict condition type for table "podcast"
 */
export interface podcast_on_conflict {
  constraint: podcast_constraint;
  update_columns: podcast_update_column[];
  where?: podcast_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast_plan"
 */
export interface podcast_plan_arr_rel_insert_input {
  data: podcast_plan_insert_input[];
  on_conflict?: podcast_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_plan". All fields are combined with a logical 'AND'.
 */
export interface podcast_plan_bool_exp {
  _and?: (podcast_plan_bool_exp | null)[] | null;
  _not?: podcast_plan_bool_exp | null;
  _or?: (podcast_plan_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  creator?: member_public_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_subscription?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  period_amount?: numeric_comparison_exp | null;
  period_type?: String_comparison_exp | null;
  podcast?: podcast_bool_exp | null;
  podcast_id?: uuid_comparison_exp | null;
  podcast_plan_enrollments?: podcast_plan_enrollment_bool_exp | null;
  position?: Int_comparison_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface podcast_plan_enrollment_bool_exp {
  _and?: (podcast_plan_enrollment_bool_exp | null)[] | null;
  _not?: podcast_plan_enrollment_bool_exp | null;
  _or?: (podcast_plan_enrollment_bool_exp | null)[] | null;
  member_id?: String_comparison_exp | null;
  podcast_plan?: podcast_plan_bool_exp | null;
  podcast_plan_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_plan"
 */
export interface podcast_plan_insert_input {
  created_at?: any | null;
  creator_id?: string | null;
  id?: any | null;
  is_subscription?: boolean | null;
  list_price?: any | null;
  period_amount?: any | null;
  period_type?: string | null;
  podcast?: podcast_obj_rel_insert_input | null;
  podcast_id?: any | null;
  position?: number | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "podcast_plan"
 */
export interface podcast_plan_on_conflict {
  constraint: podcast_plan_constraint;
  update_columns: podcast_plan_update_column[];
  where?: podcast_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast_program"
 */
export interface podcast_program_arr_rel_insert_input {
  data: podcast_program_insert_input[];
  on_conflict?: podcast_program_on_conflict | null;
}

/**
 * input type for inserting array relation for remote table "podcast_program_audio"
 */
export interface podcast_program_audio_arr_rel_insert_input {
  data: podcast_program_audio_insert_input[];
  on_conflict?: podcast_program_audio_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program_audio". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_audio_bool_exp {
  _and?: (podcast_program_audio_bool_exp | null)[] | null;
  _not?: podcast_program_audio_bool_exp | null;
  _or?: (podcast_program_audio_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  deleted_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_program_audio"
 */
export interface podcast_program_audio_insert_input {
  created_at?: any | null;
  data?: any | null;
  deleted_at?: any | null;
  id?: any | null;
  podcast_program?: podcast_program_obj_rel_insert_input | null;
  podcast_program_id?: any | null;
  position?: number | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "podcast_program_audio"
 */
export interface podcast_program_audio_on_conflict {
  constraint: podcast_program_audio_constraint;
  update_columns: podcast_program_audio_update_column[];
  where?: podcast_program_audio_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast_program_body"
 */
export interface podcast_program_body_arr_rel_insert_input {
  data: podcast_program_body_insert_input[];
  on_conflict?: podcast_program_body_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program_body". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_body_bool_exp {
  _and?: (podcast_program_body_bool_exp | null)[] | null;
  _not?: podcast_program_body_bool_exp | null;
  _or?: (podcast_program_body_bool_exp | null)[] | null;
  data?: jsonb_comparison_exp | null;
  deleted_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_program_body"
 */
export interface podcast_program_body_insert_input {
  data?: any | null;
  deleted_at?: any | null;
  description?: string | null;
  id?: any | null;
  podcast_program?: podcast_program_obj_rel_insert_input | null;
  podcast_program_id?: any | null;
  position?: number | null;
}

/**
 * input type for inserting object relation for remote table "podcast_program_body"
 */
export interface podcast_program_body_obj_rel_insert_input {
  data: podcast_program_body_insert_input;
  on_conflict?: podcast_program_body_on_conflict | null;
}

/**
 * on conflict condition type for table "podcast_program_body"
 */
export interface podcast_program_body_on_conflict {
  constraint: podcast_program_body_constraint;
  update_columns: podcast_program_body_update_column[];
  where?: podcast_program_body_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_bool_exp {
  _and?: (podcast_program_bool_exp | null)[] | null;
  _not?: podcast_program_bool_exp | null;
  _or?: (podcast_program_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  content_type?: String_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  creator?: member_public_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  duration?: numeric_comparison_exp | null;
  duration_second?: numeric_comparison_exp | null;
  filename?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  playlist_podcast_programs?: playlist_podcast_program_bool_exp | null;
  podcast?: podcast_bool_exp | null;
  podcast_id?: uuid_comparison_exp | null;
  podcast_program_audios?: podcast_program_audio_bool_exp | null;
  podcast_program_bodies?: podcast_program_body_bool_exp | null;
  podcast_program_body?: podcast_program_body_bool_exp | null;
  podcast_program_categories?: podcast_program_category_bool_exp | null;
  podcast_program_enrollments?: podcast_program_enrollment_bool_exp | null;
  podcast_program_roles?: podcast_program_role_bool_exp | null;
  podcast_program_tags?: podcast_program_tag_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  support_locales?: jsonb_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast_program_category"
 */
export interface podcast_program_category_arr_rel_insert_input {
  data: podcast_program_category_insert_input[];
  on_conflict?: podcast_program_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program_category". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_category_bool_exp {
  _and?: (podcast_program_category_bool_exp | null)[] | null;
  _not?: podcast_program_category_bool_exp | null;
  _or?: (podcast_program_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_program_category"
 */
export interface podcast_program_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  podcast_program?: podcast_program_obj_rel_insert_input | null;
  podcast_program_id?: any | null;
  position?: number | null;
}

/**
 * on conflict condition type for table "podcast_program_category"
 */
export interface podcast_program_category_on_conflict {
  constraint: podcast_program_category_constraint;
  update_columns: podcast_program_category_update_column[];
  where?: podcast_program_category_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program_enrollment". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_enrollment_bool_exp {
  _and?: (podcast_program_enrollment_bool_exp | null)[] | null;
  _not?: podcast_program_enrollment_bool_exp | null;
  _or?: (podcast_program_enrollment_bool_exp | null)[] | null;
  member_id?: String_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_program"
 */
export interface podcast_program_insert_input {
  abstract?: string | null;
  content_type?: string | null;
  cover_url?: string | null;
  creator_id?: string | null;
  duration?: any | null;
  duration_second?: any | null;
  filename?: string | null;
  id?: any | null;
  list_price?: any | null;
  playlist_podcast_programs?: playlist_podcast_program_arr_rel_insert_input | null;
  podcast?: podcast_obj_rel_insert_input | null;
  podcast_id?: any | null;
  podcast_program_audios?: podcast_program_audio_arr_rel_insert_input | null;
  podcast_program_bodies?: podcast_program_body_arr_rel_insert_input | null;
  podcast_program_body?: podcast_program_body_obj_rel_insert_input | null;
  podcast_program_categories?: podcast_program_category_arr_rel_insert_input | null;
  podcast_program_roles?: podcast_program_role_arr_rel_insert_input | null;
  podcast_program_tags?: podcast_program_tag_arr_rel_insert_input | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  support_locales?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "podcast_program"
 */
export interface podcast_program_obj_rel_insert_input {
  data: podcast_program_insert_input;
  on_conflict?: podcast_program_on_conflict | null;
}

/**
 * on conflict condition type for table "podcast_program"
 */
export interface podcast_program_on_conflict {
  constraint: podcast_program_constraint;
  update_columns: podcast_program_update_column[];
  where?: podcast_program_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast_program_role"
 */
export interface podcast_program_role_arr_rel_insert_input {
  data: podcast_program_role_insert_input[];
  on_conflict?: podcast_program_role_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program_role". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_role_bool_exp {
  _and?: (podcast_program_role_bool_exp | null)[] | null;
  _not?: podcast_program_role_bool_exp | null;
  _or?: (podcast_program_role_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_program_role"
 */
export interface podcast_program_role_insert_input {
  id?: any | null;
  member_id?: string | null;
  name?: string | null;
  podcast_program?: podcast_program_obj_rel_insert_input | null;
  podcast_program_id?: any | null;
}

/**
 * on conflict condition type for table "podcast_program_role"
 */
export interface podcast_program_role_on_conflict {
  constraint: podcast_program_role_constraint;
  update_columns: podcast_program_role_update_column[];
  where?: podcast_program_role_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "podcast_program_tag"
 */
export interface podcast_program_tag_arr_rel_insert_input {
  data: podcast_program_tag_insert_input[];
  on_conflict?: podcast_program_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "podcast_program_tag". All fields are combined with a logical 'AND'.
 */
export interface podcast_program_tag_bool_exp {
  _and?: (podcast_program_tag_bool_exp | null)[] | null;
  _not?: podcast_program_tag_bool_exp | null;
  _or?: (podcast_program_tag_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  podcast_program?: podcast_program_bool_exp | null;
  podcast_program_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "podcast_program_tag"
 */
export interface podcast_program_tag_insert_input {
  id?: any | null;
  podcast_program?: podcast_program_obj_rel_insert_input | null;
  podcast_program_id?: any | null;
  position?: number | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
}

/**
 * on conflict condition type for table "podcast_program_tag"
 */
export interface podcast_program_tag_on_conflict {
  constraint: podcast_program_tag_constraint;
  update_columns: podcast_program_tag_update_column[];
  where?: podcast_program_tag_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "point_log"
 */
export interface point_log_arr_rel_insert_input {
  data: point_log_insert_input[];
  on_conflict?: point_log_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "point_log". All fields are combined with a logical 'AND'.
 */
export interface point_log_bool_exp {
  _and?: (point_log_bool_exp | null)[] | null;
  _not?: point_log_bool_exp | null;
  _or?: (point_log_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  note?: String_comparison_exp | null;
  point?: numeric_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "point_log"
 */
export interface point_log_insert_input {
  created_at?: any | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  note?: string | null;
  point?: any | null;
  started_at?: any | null;
}

/**
 * on conflict condition type for table "point_log"
 */
export interface point_log_on_conflict {
  constraint: point_log_constraint;
  update_columns: point_log_update_column[];
  where?: point_log_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "point_status". All fields are combined with a logical 'AND'.
 */
export interface point_status_bool_exp {
  _and?: (point_status_bool_exp | null)[] | null;
  _not?: point_status_bool_exp | null;
  _or?: (point_status_bool_exp | null)[] | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  points?: numeric_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "post"
 */
export interface post_arr_rel_insert_input {
  data: post_insert_input[];
  on_conflict?: post_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post". All fields are combined with a logical 'AND'.
 */
export interface post_bool_exp {
  _and?: (post_bool_exp | null)[] | null;
  _not?: post_bool_exp | null;
  _or?: (post_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  code_name?: String_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  position?: Int_comparison_exp | null;
  post_categories?: post_category_bool_exp | null;
  post_merchandises?: post_merchandise_bool_exp | null;
  post_roles?: post_role_bool_exp | null;
  post_tags?: post_tag_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
  video_url?: String_comparison_exp | null;
  views?: Int_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "post_category"
 */
export interface post_category_arr_rel_insert_input {
  data: post_category_insert_input[];
  on_conflict?: post_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post_category". All fields are combined with a logical 'AND'.
 */
export interface post_category_bool_exp {
  _and?: (post_category_bool_exp | null)[] | null;
  _not?: post_category_bool_exp | null;
  _or?: (post_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "post_category"
 */
export interface post_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  position?: number | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: any | null;
}

/**
 * on conflict condition type for table "post_category"
 */
export interface post_category_on_conflict {
  constraint: post_category_constraint;
  update_columns: post_category_update_column[];
  where?: post_category_bool_exp | null;
}

/**
 * input type for inserting data into table "post"
 */
export interface post_insert_input {
  abstract?: string | null;
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  code_name?: string | null;
  cover_url?: string | null;
  created_at?: any | null;
  description?: string | null;
  id?: any | null;
  is_deleted?: boolean | null;
  position?: number | null;
  post_categories?: post_category_arr_rel_insert_input | null;
  post_merchandises?: post_merchandise_arr_rel_insert_input | null;
  post_roles?: post_role_arr_rel_insert_input | null;
  post_tags?: post_tag_arr_rel_insert_input | null;
  published_at?: any | null;
  title?: string | null;
  updated_at?: any | null;
  video_url?: string | null;
  views?: number | null;
}

/**
 * input type for inserting array relation for remote table "post_merchandise"
 */
export interface post_merchandise_arr_rel_insert_input {
  data: post_merchandise_insert_input[];
  on_conflict?: post_merchandise_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post_merchandise". All fields are combined with a logical 'AND'.
 */
export interface post_merchandise_bool_exp {
  _and?: (post_merchandise_bool_exp | null)[] | null;
  _not?: post_merchandise_bool_exp | null;
  _or?: (post_merchandise_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  merchandise?: merchandise_bool_exp | null;
  merchandise_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "post_merchandise"
 */
export interface post_merchandise_insert_input {
  id?: any | null;
  merchandise?: merchandise_obj_rel_insert_input | null;
  merchandise_id?: any | null;
  position?: number | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: any | null;
}

/**
 * on conflict condition type for table "post_merchandise"
 */
export interface post_merchandise_on_conflict {
  constraint: post_merchandise_constraint;
  update_columns: post_merchandise_update_column[];
  where?: post_merchandise_bool_exp | null;
}

/**
 * input type for inserting object relation for remote table "post"
 */
export interface post_obj_rel_insert_input {
  data: post_insert_input;
  on_conflict?: post_on_conflict | null;
}

/**
 * on conflict condition type for table "post"
 */
export interface post_on_conflict {
  constraint: post_constraint;
  update_columns: post_update_column[];
  where?: post_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "post_role"
 */
export interface post_role_arr_rel_insert_input {
  data: post_role_insert_input[];
  on_conflict?: post_role_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post_role". All fields are combined with a logical 'AND'.
 */
export interface post_role_bool_exp {
  _and?: (post_role_bool_exp | null)[] | null;
  _not?: post_role_bool_exp | null;
  _or?: (post_role_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "post_role"
 */
export interface post_role_insert_input {
  id?: any | null;
  member_id?: string | null;
  name?: string | null;
  position?: number | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: any | null;
}

/**
 * on conflict condition type for table "post_role"
 */
export interface post_role_on_conflict {
  constraint: post_role_constraint;
  update_columns: post_role_update_column[];
  where?: post_role_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "post_tag"
 */
export interface post_tag_arr_rel_insert_input {
  data: post_tag_insert_input[];
  on_conflict?: post_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "post_tag". All fields are combined with a logical 'AND'.
 */
export interface post_tag_bool_exp {
  _and?: (post_tag_bool_exp | null)[] | null;
  _not?: post_tag_bool_exp | null;
  _or?: (post_tag_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  post?: post_bool_exp | null;
  post_id?: uuid_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "post_tag"
 */
export interface post_tag_insert_input {
  id?: any | null;
  position?: number | null;
  post?: post_obj_rel_insert_input | null;
  post_id?: any | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
}

/**
 * on conflict condition type for table "post_tag"
 */
export interface post_tag_on_conflict {
  constraint: post_tag_constraint;
  update_columns: post_tag_update_column[];
  where?: post_tag_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "practice"
 */
export interface practice_arr_rel_insert_input {
  data: practice_insert_input[];
  on_conflict?: practice_on_conflict | null;
}

/**
 * input type for inserting array relation for remote table "practice_attachment"
 */
export interface practice_attachment_arr_rel_insert_input {
  data: practice_attachment_insert_input[];
}

/**
 * Boolean expression to filter rows from the table "practice_attachment". All fields are combined with a logical 'AND'.
 */
export interface practice_attachment_bool_exp {
  _and?: (practice_attachment_bool_exp | null)[] | null;
  _not?: practice_attachment_bool_exp | null;
  _or?: (practice_attachment_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  attachment?: attachment_bool_exp | null;
  attachment_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  practice?: practice_bool_exp | null;
  practice_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "practice_attachment"
 */
export interface practice_attachment_insert_input {
  app_id?: string | null;
  attachment?: attachment_obj_rel_insert_input | null;
  attachment_id?: any | null;
  created_at?: any | null;
  data?: any | null;
  options?: any | null;
  practice?: practice_obj_rel_insert_input | null;
  practice_id?: any | null;
  updated_at?: any | null;
}

/**
 * Boolean expression to filter rows from the table "practice". All fields are combined with a logical 'AND'.
 */
export interface practice_bool_exp {
  _and?: (practice_bool_exp | null)[] | null;
  _not?: practice_bool_exp | null;
  _or?: (practice_bool_exp | null)[] | null;
  cover_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  practice_attachments?: practice_attachment_bool_exp | null;
  practice_issues?: practice_issue_bool_exp | null;
  practice_reactions?: practice_reaction_bool_exp | null;
  program_content?: program_content_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  reviewed_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "practice"
 */
export interface practice_insert_input {
  cover_url?: string | null;
  created_at?: any | null;
  description?: string | null;
  id?: any | null;
  is_deleted?: boolean | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  practice_attachments?: practice_attachment_arr_rel_insert_input | null;
  practice_reactions?: practice_reaction_arr_rel_insert_input | null;
  program_content?: program_content_obj_rel_insert_input | null;
  program_content_id?: any | null;
  reviewed_at?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * Boolean expression to filter rows from the table "practice_issue". All fields are combined with a logical 'AND'.
 */
export interface practice_issue_bool_exp {
  _and?: (practice_issue_bool_exp | null)[] | null;
  _not?: practice_issue_bool_exp | null;
  _or?: (practice_issue_bool_exp | null)[] | null;
  issue?: issue_bool_exp | null;
  issue_id?: uuid_comparison_exp | null;
  practice?: practice_bool_exp | null;
  practice_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting object relation for remote table "practice"
 */
export interface practice_obj_rel_insert_input {
  data: practice_insert_input;
  on_conflict?: practice_on_conflict | null;
}

/**
 * on conflict condition type for table "practice"
 */
export interface practice_on_conflict {
  constraint: practice_constraint;
  update_columns: practice_update_column[];
  where?: practice_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "practice_reaction"
 */
export interface practice_reaction_arr_rel_insert_input {
  data: practice_reaction_insert_input[];
  on_conflict?: practice_reaction_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "practice_reaction". All fields are combined with a logical 'AND'.
 */
export interface practice_reaction_bool_exp {
  _and?: (practice_reaction_bool_exp | null)[] | null;
  _not?: practice_reaction_bool_exp | null;
  _or?: (practice_reaction_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  practice?: practice_bool_exp | null;
  practice_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "practice_reaction"
 */
export interface practice_reaction_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  practice?: practice_obj_rel_insert_input | null;
  practice_id?: any | null;
}

/**
 * on conflict condition type for table "practice_reaction"
 */
export interface practice_reaction_on_conflict {
  constraint: practice_reaction_constraint;
  update_columns: practice_reaction_update_column[];
  where?: practice_reaction_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "product". All fields are combined with a logical 'AND'.
 */
export interface product_bool_exp {
  _and?: (product_bool_exp | null)[] | null;
  _not?: product_bool_exp | null;
  _or?: (product_bool_exp | null)[] | null;
  card_discounts?: card_discount_bool_exp | null;
  cart_products?: cart_product_bool_exp | null;
  coupon_plan_products?: coupon_plan_product_bool_exp | null;
  id?: String_comparison_exp | null;
  order_products?: order_product_bool_exp | null;
  product_enrollments?: product_enrollment_bool_exp | null;
  product_inventories?: product_inventory_bool_exp | null;
  product_inventory_status?: product_inventory_status_bool_exp | null;
  product_owner?: product_owner_bool_exp | null;
  target?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
  voucher_plan_products?: voucher_plan_product_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "product_enrollment". All fields are combined with a logical 'AND'.
 */
export interface product_enrollment_bool_exp {
  _and?: (product_enrollment_bool_exp | null)[] | null;
  _not?: product_enrollment_bool_exp | null;
  _or?: (product_enrollment_bool_exp | null)[] | null;
  is_physical?: Boolean_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "product"
 */
export interface product_insert_input {
  card_discounts?: card_discount_arr_rel_insert_input | null;
  cart_products?: cart_product_arr_rel_insert_input | null;
  coupon_plan_products?: coupon_plan_product_arr_rel_insert_input | null;
  id?: string | null;
  order_products?: order_product_arr_rel_insert_input | null;
  product_inventories?: product_inventory_arr_rel_insert_input | null;
  target?: string | null;
  type?: string | null;
  voucher_plan_products?: voucher_plan_product_arr_rel_insert_input | null;
}

/**
 * input type for inserting array relation for remote table "product_inventory"
 */
export interface product_inventory_arr_rel_insert_input {
  data: product_inventory_insert_input[];
  on_conflict?: product_inventory_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "product_inventory". All fields are combined with a logical 'AND'.
 */
export interface product_inventory_bool_exp {
  _and?: (product_inventory_bool_exp | null)[] | null;
  _not?: product_inventory_bool_exp | null;
  _or?: (product_inventory_bool_exp | null)[] | null;
  comment?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
  quantity?: Int_comparison_exp | null;
  specification?: String_comparison_exp | null;
  status?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "product_inventory"
 */
export interface product_inventory_insert_input {
  comment?: string | null;
  created_at?: any | null;
  id?: any | null;
  product?: product_obj_rel_insert_input | null;
  product_id?: string | null;
  quantity?: number | null;
  specification?: string | null;
  status?: string | null;
}

/**
 * on conflict condition type for table "product_inventory"
 */
export interface product_inventory_on_conflict {
  constraint: product_inventory_constraint;
  update_columns: product_inventory_update_column[];
  where?: product_inventory_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "product_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface product_inventory_status_bool_exp {
  _and?: (product_inventory_status_bool_exp | null)[] | null;
  _not?: product_inventory_status_bool_exp | null;
  _or?: (product_inventory_status_bool_exp | null)[] | null;
  buyable_quantity?: bigint_comparison_exp | null;
  delivered_quantity?: bigint_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
  total_quantity?: bigint_comparison_exp | null;
  undelivered_quantity?: bigint_comparison_exp | null;
}

/**
 * input type for inserting object relation for remote table "product"
 */
export interface product_obj_rel_insert_input {
  data: product_insert_input;
  on_conflict?: product_on_conflict | null;
}

/**
 * on conflict condition type for table "product"
 */
export interface product_on_conflict {
  constraint: product_constraint;
  update_columns: product_update_column[];
  where?: product_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "product_owner". All fields are combined with a logical 'AND'.
 */
export interface product_owner_bool_exp {
  _and?: (product_owner_bool_exp | null)[] | null;
  _not?: product_owner_bool_exp | null;
  _or?: (product_owner_bool_exp | null)[] | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
  target?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_announcement"
 */
export interface program_announcement_arr_rel_insert_input {
  data: program_announcement_insert_input[];
  on_conflict?: program_announcement_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_announcement". All fields are combined with a logical 'AND'.
 */
export interface program_announcement_bool_exp {
  _and?: (program_announcement_bool_exp | null)[] | null;
  _not?: program_announcement_bool_exp | null;
  _or?: (program_announcement_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_announcement"
 */
export interface program_announcement_insert_input {
  created_at?: any | null;
  description?: string | null;
  id?: any | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
  published_at?: any | null;
  title?: string | null;
}

/**
 * on conflict condition type for table "program_announcement"
 */
export interface program_announcement_on_conflict {
  constraint: program_announcement_constraint;
  update_columns: program_announcement_update_column[];
  where?: program_announcement_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_approval"
 */
export interface program_approval_arr_rel_insert_input {
  data: program_approval_insert_input[];
  on_conflict?: program_approval_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_approval". All fields are combined with a logical 'AND'.
 */
export interface program_approval_bool_exp {
  _and?: (program_approval_bool_exp | null)[] | null;
  _not?: program_approval_bool_exp | null;
  _or?: (program_approval_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  feedback?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  status?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_approval"
 */
export interface program_approval_insert_input {
  created_at?: any | null;
  description?: string | null;
  feedback?: string | null;
  id?: any | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
  status?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "program_approval"
 */
export interface program_approval_on_conflict {
  constraint: program_approval_constraint;
  update_columns: program_approval_update_column[];
  where?: program_approval_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_approval_status". All fields are combined with a logical 'AND'.
 */
export interface program_approval_status_bool_exp {
  _and?: (program_approval_status_bool_exp | null)[] | null;
  _not?: program_approval_status_bool_exp | null;
  _or?: (program_approval_status_bool_exp | null)[] | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  status?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "program"
 */
export interface program_arr_rel_insert_input {
  data: program_insert_input[];
  on_conflict?: program_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program". All fields are combined with a logical 'AND'.
 */
export interface program_bool_exp {
  _and?: (program_bool_exp | null)[] | null;
  _not?: program_bool_exp | null;
  _or?: (program_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  cover_video_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  editors?: program_editor_bool_exp | null;
  id?: uuid_comparison_exp | null;
  in_advance?: Boolean_comparison_exp | null;
  is_countdown_timer_visible?: Boolean_comparison_exp | null;
  is_deleted?: Boolean_comparison_exp | null;
  is_issues_open?: Boolean_comparison_exp | null;
  is_private?: Boolean_comparison_exp | null;
  is_sold_out?: Boolean_comparison_exp | null;
  is_subscription?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  package_items?: package_item_bool_exp | null;
  position?: Int_comparison_exp | null;
  program_announcements?: program_announcement_bool_exp | null;
  program_approval_status?: program_approval_status_bool_exp | null;
  program_approvals?: program_approval_bool_exp | null;
  program_categories?: program_category_bool_exp | null;
  program_content_enrollments?: program_content_enrollment_bool_exp | null;
  program_content_progress_enrollments?: program_content_progress_enrollment_bool_exp | null;
  program_content_sections?: program_content_section_bool_exp | null;
  program_enrollments?: program_enrollment_bool_exp | null;
  program_package_programs?: program_package_program_bool_exp | null;
  program_plans?: program_plan_bool_exp | null;
  program_related_items?: program_related_item_bool_exp | null;
  program_roles?: program_role_bool_exp | null;
  program_tags?: program_tag_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  support_locales?: jsonb_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_category"
 */
export interface program_category_arr_rel_insert_input {
  data: program_category_insert_input[];
  on_conflict?: program_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_category". All fields are combined with a logical 'AND'.
 */
export interface program_category_bool_exp {
  _and?: (program_category_bool_exp | null)[] | null;
  _not?: program_category_bool_exp | null;
  _or?: (program_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_category"
 */
export interface program_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  position?: number | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
}

/**
 * on conflict condition type for table "program_category"
 */
export interface program_category_on_conflict {
  constraint: program_category_constraint;
  update_columns: program_category_update_column[];
  where?: program_category_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_content"
 */
export interface program_content_arr_rel_insert_input {
  data: program_content_insert_input[];
  on_conflict?: program_content_on_conflict | null;
}

/**
 * input type for inserting array relation for remote table "program_content_attachment"
 */
export interface program_content_attachment_arr_rel_insert_input {
  data: program_content_attachment_insert_input[];
}

/**
 * Boolean expression to filter rows from the table "program_content_attachment". All fields are combined with a logical 'AND'.
 */
export interface program_content_attachment_bool_exp {
  _and?: (program_content_attachment_bool_exp | null)[] | null;
  _not?: program_content_attachment_bool_exp | null;
  _or?: (program_content_attachment_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  attachment?: attachment_bool_exp | null;
  attachment_id?: uuid_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  program_content?: program_content_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content_attachment"
 */
export interface program_content_attachment_insert_input {
  app_id?: string | null;
  attachment?: attachment_obj_rel_insert_input | null;
  attachment_id?: any | null;
  created_at?: any | null;
  data?: any | null;
  options?: any | null;
  program_content?: program_content_obj_rel_insert_input | null;
  program_content_id?: any | null;
  updated_at?: any | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_body". All fields are combined with a logical 'AND'.
 */
export interface program_content_body_bool_exp {
  _and?: (program_content_body_bool_exp | null)[] | null;
  _not?: program_content_body_bool_exp | null;
  _or?: (program_content_body_bool_exp | null)[] | null;
  data?: jsonb_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  program_contents?: program_content_bool_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content_body"
 */
export interface program_content_body_insert_input {
  data?: any | null;
  description?: string | null;
  id?: any | null;
  program_contents?: program_content_arr_rel_insert_input | null;
  type?: string | null;
}

/**
 * input type for inserting object relation for remote table "program_content_body"
 */
export interface program_content_body_obj_rel_insert_input {
  data: program_content_body_insert_input;
  on_conflict?: program_content_body_on_conflict | null;
}

/**
 * on conflict condition type for table "program_content_body"
 */
export interface program_content_body_on_conflict {
  constraint: program_content_body_constraint;
  update_columns: program_content_body_update_column[];
  where?: program_content_body_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_content". All fields are combined with a logical 'AND'.
 */
export interface program_content_bool_exp {
  _and?: (program_content_bool_exp | null)[] | null;
  _not?: program_content_bool_exp | null;
  _or?: (program_content_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  content_body_id?: uuid_comparison_exp | null;
  content_section_id?: uuid_comparison_exp | null;
  content_type?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  duration?: numeric_comparison_exp | null;
  enrollments?: program_content_enrollment_bool_exp | null;
  exercises?: exercise_bool_exp | null;
  id?: uuid_comparison_exp | null;
  is_notify_update?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  metadata?: jsonb_comparison_exp | null;
  notified_at?: timestamptz_comparison_exp | null;
  position?: Int_comparison_exp | null;
  practices?: practice_bool_exp | null;
  program_content_attachments?: program_content_attachment_bool_exp | null;
  program_content_body?: program_content_body_bool_exp | null;
  program_content_materials?: program_content_material_bool_exp | null;
  program_content_plans?: program_content_plan_bool_exp | null;
  program_content_progress?: program_content_progress_bool_exp | null;
  program_content_section?: program_content_section_bool_exp | null;
  program_content_type?: program_content_type_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_content_enrollment_bool_exp {
  _and?: (program_content_enrollment_bool_exp | null)[] | null;
  _not?: program_content_enrollment_bool_exp | null;
  _or?: (program_content_enrollment_bool_exp | null)[] | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  program?: program_bool_exp | null;
  program_content?: program_content_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content"
 */
export interface program_content_insert_input {
  abstract?: string | null;
  content_body_id?: any | null;
  content_section_id?: any | null;
  content_type?: string | null;
  created_at?: any | null;
  duration?: any | null;
  exercises?: exercise_arr_rel_insert_input | null;
  id?: any | null;
  is_notify_update?: boolean | null;
  list_price?: any | null;
  metadata?: any | null;
  notified_at?: any | null;
  position?: number | null;
  practices?: practice_arr_rel_insert_input | null;
  program_content_attachments?: program_content_attachment_arr_rel_insert_input | null;
  program_content_body?: program_content_body_obj_rel_insert_input | null;
  program_content_materials?: program_content_material_arr_rel_insert_input | null;
  program_content_plans?: program_content_plan_arr_rel_insert_input | null;
  program_content_progress?: program_content_progress_arr_rel_insert_input | null;
  program_content_section?: program_content_section_obj_rel_insert_input | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  title?: string | null;
}

/**
 * input type for inserting array relation for remote table "program_content_material"
 */
export interface program_content_material_arr_rel_insert_input {
  data: program_content_material_insert_input[];
  on_conflict?: program_content_material_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_material". All fields are combined with a logical 'AND'.
 */
export interface program_content_material_bool_exp {
  _and?: (program_content_material_bool_exp | null)[] | null;
  _not?: program_content_material_bool_exp | null;
  _or?: (program_content_material_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  data?: jsonb_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  program_contents?: program_content_bool_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content_material"
 */
export interface program_content_material_insert_input {
  created_at?: any | null;
  data?: any | null;
  id?: any | null;
  program_content_id?: any | null;
  program_contents?: program_content_obj_rel_insert_input | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "program_content_material"
 */
export interface program_content_material_on_conflict {
  constraint: program_content_material_constraint;
  update_columns: program_content_material_update_column[];
  where?: program_content_material_bool_exp | null;
}

/**
 * input type for inserting object relation for remote table "program_content"
 */
export interface program_content_obj_rel_insert_input {
  data: program_content_insert_input;
  on_conflict?: program_content_on_conflict | null;
}

/**
 * on conflict condition type for table "program_content"
 */
export interface program_content_on_conflict {
  constraint: program_content_constraint;
  update_columns: program_content_update_column[];
  where?: program_content_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_content_plan"
 */
export interface program_content_plan_arr_rel_insert_input {
  data: program_content_plan_insert_input[];
  on_conflict?: program_content_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_plan". All fields are combined with a logical 'AND'.
 */
export interface program_content_plan_bool_exp {
  _and?: (program_content_plan_bool_exp | null)[] | null;
  _not?: program_content_plan_bool_exp | null;
  _or?: (program_content_plan_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  program_content?: program_content_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  program_plan?: program_plan_bool_exp | null;
  program_plan_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content_plan"
 */
export interface program_content_plan_insert_input {
  id?: any | null;
  program_content?: program_content_obj_rel_insert_input | null;
  program_content_id?: any | null;
  program_plan?: program_plan_obj_rel_insert_input | null;
  program_plan_id?: any | null;
}

/**
 * on conflict condition type for table "program_content_plan"
 */
export interface program_content_plan_on_conflict {
  constraint: program_content_plan_constraint;
  update_columns: program_content_plan_update_column[];
  where?: program_content_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_content_progress"
 */
export interface program_content_progress_arr_rel_insert_input {
  data: program_content_progress_insert_input[];
  on_conflict?: program_content_progress_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_progress". All fields are combined with a logical 'AND'.
 */
export interface program_content_progress_bool_exp {
  _and?: (program_content_progress_bool_exp | null)[] | null;
  _not?: program_content_progress_bool_exp | null;
  _or?: (program_content_progress_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  last_progress?: numeric_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  program_content?: program_content_bool_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  progress?: numeric_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_progress_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_content_progress_enrollment_bool_exp {
  _and?: (program_content_progress_enrollment_bool_exp | null)[] | null;
  _not?: program_content_progress_enrollment_bool_exp | null;
  _or?: (program_content_progress_enrollment_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  last_progress?: numeric_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  program_content_id?: uuid_comparison_exp | null;
  program_content_section_id?: uuid_comparison_exp | null;
  program_id?: uuid_comparison_exp | null;
  progress?: numeric_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content_progress"
 */
export interface program_content_progress_insert_input {
  created_at?: any | null;
  id?: any | null;
  last_progress?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  program_content?: program_content_obj_rel_insert_input | null;
  program_content_id?: any | null;
  progress?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "program_content_progress"
 */
export interface program_content_progress_on_conflict {
  constraint: program_content_progress_constraint;
  update_columns: program_content_progress_update_column[];
  where?: program_content_progress_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_content_section"
 */
export interface program_content_section_arr_rel_insert_input {
  data: program_content_section_insert_input[];
  on_conflict?: program_content_section_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_section". All fields are combined with a logical 'AND'.
 */
export interface program_content_section_bool_exp {
  _and?: (program_content_section_bool_exp | null)[] | null;
  _not?: program_content_section_bool_exp | null;
  _or?: (program_content_section_bool_exp | null)[] | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  program?: program_bool_exp | null;
  program_contents?: program_content_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_content_section"
 */
export interface program_content_section_insert_input {
  description?: string | null;
  id?: any | null;
  position?: number | null;
  program?: program_obj_rel_insert_input | null;
  program_contents?: program_content_arr_rel_insert_input | null;
  program_id?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "program_content_section"
 */
export interface program_content_section_obj_rel_insert_input {
  data: program_content_section_insert_input;
  on_conflict?: program_content_section_on_conflict | null;
}

/**
 * on conflict condition type for table "program_content_section"
 */
export interface program_content_section_on_conflict {
  constraint: program_content_section_constraint;
  update_columns: program_content_section_update_column[];
  where?: program_content_section_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_content_type". All fields are combined with a logical 'AND'.
 */
export interface program_content_type_bool_exp {
  _and?: (program_content_type_bool_exp | null)[] | null;
  _not?: program_content_type_bool_exp | null;
  _or?: (program_content_type_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  program_content?: program_content_bool_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_editor"
 */
export interface program_editor_arr_rel_insert_input {
  data: program_editor_insert_input[];
}

/**
 * Boolean expression to filter rows from the table "program_editor". All fields are combined with a logical 'AND'.
 */
export interface program_editor_bool_exp {
  _and?: (program_editor_bool_exp | null)[] | null;
  _not?: program_editor_bool_exp | null;
  _or?: (program_editor_bool_exp | null)[] | null;
  member_id?: String_comparison_exp | null;
  program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_editor"
 */
export interface program_editor_insert_input {
  member_id?: string | null;
  program_id?: any | null;
}

/**
 * Boolean expression to filter rows from the table "program_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_enrollment_bool_exp {
  _and?: (program_enrollment_bool_exp | null)[] | null;
  _not?: program_enrollment_bool_exp | null;
  _or?: (program_enrollment_bool_exp | null)[] | null;
  member?: member_bool_exp | null;
  member_email?: String_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  member_name?: String_comparison_exp | null;
  member_picture_url?: String_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "program"
 */
export interface program_insert_input {
  abstract?: string | null;
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  cover_url?: string | null;
  cover_video_url?: string | null;
  created_at?: any | null;
  description?: string | null;
  editors?: program_editor_arr_rel_insert_input | null;
  id?: any | null;
  in_advance?: boolean | null;
  is_countdown_timer_visible?: boolean | null;
  is_deleted?: boolean | null;
  is_issues_open?: boolean | null;
  is_private?: boolean | null;
  is_sold_out?: boolean | null;
  is_subscription?: boolean | null;
  list_price?: any | null;
  package_items?: package_item_arr_rel_insert_input | null;
  position?: number | null;
  program_announcements?: program_announcement_arr_rel_insert_input | null;
  program_approvals?: program_approval_arr_rel_insert_input | null;
  program_categories?: program_category_arr_rel_insert_input | null;
  program_content_sections?: program_content_section_arr_rel_insert_input | null;
  program_package_programs?: program_package_program_arr_rel_insert_input | null;
  program_plans?: program_plan_arr_rel_insert_input | null;
  program_related_items?: program_related_item_arr_rel_insert_input | null;
  program_roles?: program_role_arr_rel_insert_input | null;
  program_tags?: program_tag_arr_rel_insert_input | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  support_locales?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "program"
 */
export interface program_obj_rel_insert_input {
  data: program_insert_input;
  on_conflict?: program_on_conflict | null;
}

/**
 * on conflict condition type for table "program"
 */
export interface program_on_conflict {
  constraint: program_constraint;
  update_columns: program_update_column[];
  where?: program_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_package"
 */
export interface program_package_arr_rel_insert_input {
  data: program_package_insert_input[];
  on_conflict?: program_package_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_package". All fields are combined with a logical 'AND'.
 */
export interface program_package_bool_exp {
  _and?: (program_package_bool_exp | null)[] | null;
  _not?: program_package_bool_exp | null;
  _or?: (program_package_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  creator?: member_public_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  program_package_categories?: program_package_category_bool_exp | null;
  program_package_plans?: program_package_plan_bool_exp | null;
  program_package_programs?: program_package_program_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_package_category"
 */
export interface program_package_category_arr_rel_insert_input {
  data: program_package_category_insert_input[];
  on_conflict?: program_package_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_package_category". All fields are combined with a logical 'AND'.
 */
export interface program_package_category_bool_exp {
  _and?: (program_package_category_bool_exp | null)[] | null;
  _not?: program_package_category_bool_exp | null;
  _or?: (program_package_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  program_package?: program_package_bool_exp | null;
  program_package_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_package_category"
 */
export interface program_package_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  position?: number | null;
  program_package?: program_package_obj_rel_insert_input | null;
  program_package_id?: any | null;
}

/**
 * on conflict condition type for table "program_package_category"
 */
export interface program_package_category_on_conflict {
  constraint: program_package_category_constraint;
  update_columns: program_package_category_update_column[];
  where?: program_package_category_bool_exp | null;
}

/**
 * input type for inserting data into table "program_package"
 */
export interface program_package_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  cover_url?: string | null;
  created_at?: any | null;
  creator_id?: string | null;
  description?: string | null;
  id?: any | null;
  program_package_categories?: program_package_category_arr_rel_insert_input | null;
  program_package_plans?: program_package_plan_arr_rel_insert_input | null;
  program_package_programs?: program_package_program_arr_rel_insert_input | null;
  published_at?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "program_package"
 */
export interface program_package_obj_rel_insert_input {
  data: program_package_insert_input;
  on_conflict?: program_package_on_conflict | null;
}

/**
 * on conflict condition type for table "program_package"
 */
export interface program_package_on_conflict {
  constraint: program_package_constraint;
  update_columns: program_package_update_column[];
  where?: program_package_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_package_plan"
 */
export interface program_package_plan_arr_rel_insert_input {
  data: program_package_plan_insert_input[];
  on_conflict?: program_package_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_package_plan". All fields are combined with a logical 'AND'.
 */
export interface program_package_plan_bool_exp {
  _and?: (program_package_plan_bool_exp | null)[] | null;
  _not?: program_package_plan_bool_exp | null;
  _or?: (program_package_plan_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  description?: String_comparison_exp | null;
  discount_down_price?: numeric_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_participants_visible?: Boolean_comparison_exp | null;
  is_subscription?: Boolean_comparison_exp | null;
  is_tempo_delivery?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  period_amount?: numeric_comparison_exp | null;
  period_type?: String_comparison_exp | null;
  position?: numeric_comparison_exp | null;
  program_package?: program_package_bool_exp | null;
  program_package_id?: uuid_comparison_exp | null;
  program_package_plan_enrollments?: program_package_plan_enrollment_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_package_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_package_plan_enrollment_bool_exp {
  _and?: (program_package_plan_enrollment_bool_exp | null)[] | null;
  _not?: program_package_plan_enrollment_bool_exp | null;
  _or?: (program_package_plan_enrollment_bool_exp | null)[] | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  program_package_plan?: program_package_plan_bool_exp | null;
  program_package_plan_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_package_plan"
 */
export interface program_package_plan_insert_input {
  created_at?: any | null;
  description?: string | null;
  discount_down_price?: any | null;
  id?: any | null;
  is_participants_visible?: boolean | null;
  is_subscription?: boolean | null;
  is_tempo_delivery?: boolean | null;
  list_price?: any | null;
  period_amount?: any | null;
  period_type?: string | null;
  position?: any | null;
  program_package?: program_package_obj_rel_insert_input | null;
  program_package_id?: any | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  title?: string | null;
}

/**
 * on conflict condition type for table "program_package_plan"
 */
export interface program_package_plan_on_conflict {
  constraint: program_package_plan_constraint;
  update_columns: program_package_plan_update_column[];
  where?: program_package_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_package_program"
 */
export interface program_package_program_arr_rel_insert_input {
  data: program_package_program_insert_input[];
  on_conflict?: program_package_program_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_package_program". All fields are combined with a logical 'AND'.
 */
export interface program_package_program_bool_exp {
  _and?: (program_package_program_bool_exp | null)[] | null;
  _not?: program_package_program_bool_exp | null;
  _or?: (program_package_program_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  program_package?: program_package_bool_exp | null;
  program_package_id?: uuid_comparison_exp | null;
  program_tempo_deliveries?: program_tempo_delivery_bool_exp | null;
}

/**
 * input type for inserting data into table "program_package_program"
 */
export interface program_package_program_insert_input {
  id?: any | null;
  position?: number | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
  program_package?: program_package_obj_rel_insert_input | null;
  program_package_id?: any | null;
  program_tempo_deliveries?: program_tempo_delivery_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "program_package_program"
 */
export interface program_package_program_obj_rel_insert_input {
  data: program_package_program_insert_input;
  on_conflict?: program_package_program_on_conflict | null;
}

/**
 * on conflict condition type for table "program_package_program"
 */
export interface program_package_program_on_conflict {
  constraint: program_package_program_constraint;
  update_columns: program_package_program_update_column[];
  where?: program_package_program_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_plan"
 */
export interface program_plan_arr_rel_insert_input {
  data: program_plan_insert_input[];
  on_conflict?: program_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_plan". All fields are combined with a logical 'AND'.
 */
export interface program_plan_bool_exp {
  _and?: (program_plan_bool_exp | null)[] | null;
  _not?: program_plan_bool_exp | null;
  _or?: (program_plan_bool_exp | null)[] | null;
  auto_renewed?: Boolean_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  currency?: currency_bool_exp | null;
  currency_id?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  discount_down_price?: numeric_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  gains?: jsonb_comparison_exp | null;
  group_buying_people?: numeric_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_countdown_timer_visible?: Boolean_comparison_exp | null;
  is_participants_visible?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  period_amount?: numeric_comparison_exp | null;
  period_type?: String_comparison_exp | null;
  program?: program_bool_exp | null;
  program_content_permissions?: program_content_plan_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  program_plan_enrollments?: program_plan_enrollment_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  type?: Int_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "program_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface program_plan_enrollment_bool_exp {
  _and?: (program_plan_enrollment_bool_exp | null)[] | null;
  _not?: program_plan_enrollment_bool_exp | null;
  _or?: (program_plan_enrollment_bool_exp | null)[] | null;
  ended_at?: timestamptz_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  program_plan?: program_plan_bool_exp | null;
  program_plan_id?: uuid_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_plan"
 */
export interface program_plan_insert_input {
  auto_renewed?: boolean | null;
  created_at?: any | null;
  currency?: currency_obj_rel_insert_input | null;
  currency_id?: string | null;
  description?: string | null;
  discount_down_price?: any | null;
  ended_at?: any | null;
  gains?: any | null;
  group_buying_people?: any | null;
  id?: any | null;
  is_countdown_timer_visible?: boolean | null;
  is_participants_visible?: boolean | null;
  list_price?: any | null;
  period_amount?: any | null;
  period_type?: string | null;
  program?: program_obj_rel_insert_input | null;
  program_content_permissions?: program_content_plan_arr_rel_insert_input | null;
  program_id?: any | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  started_at?: any | null;
  title?: string | null;
  type?: number | null;
}

/**
 * input type for inserting object relation for remote table "program_plan"
 */
export interface program_plan_obj_rel_insert_input {
  data: program_plan_insert_input;
  on_conflict?: program_plan_on_conflict | null;
}

/**
 * on conflict condition type for table "program_plan"
 */
export interface program_plan_on_conflict {
  constraint: program_plan_constraint;
  update_columns: program_plan_update_column[];
  where?: program_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_related_item"
 */
export interface program_related_item_arr_rel_insert_input {
  data: program_related_item_insert_input[];
  on_conflict?: program_related_item_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_related_item". All fields are combined with a logical 'AND'.
 */
export interface program_related_item_bool_exp {
  _and?: (program_related_item_bool_exp | null)[] | null;
  _not?: program_related_item_bool_exp | null;
  _or?: (program_related_item_bool_exp | null)[] | null;
  class?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  target?: jsonb_comparison_exp | null;
  weight?: numeric_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_related_item"
 */
export interface program_related_item_insert_input {
  class?: string | null;
  id?: any | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
  target?: any | null;
  weight?: any | null;
}

/**
 * on conflict condition type for table "program_related_item"
 */
export interface program_related_item_on_conflict {
  constraint: program_related_item_constraint;
  update_columns: program_related_item_update_column[];
  where?: program_related_item_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_role"
 */
export interface program_role_arr_rel_insert_input {
  data: program_role_insert_input[];
  on_conflict?: program_role_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_role". All fields are combined with a logical 'AND'.
 */
export interface program_role_bool_exp {
  _and?: (program_role_bool_exp | null)[] | null;
  _not?: program_role_bool_exp | null;
  _or?: (program_role_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_role"
 */
export interface program_role_insert_input {
  id?: any | null;
  member_id?: string | null;
  name?: string | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
}

/**
 * on conflict condition type for table "program_role"
 */
export interface program_role_on_conflict {
  constraint: program_role_constraint;
  update_columns: program_role_update_column[];
  where?: program_role_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_tag"
 */
export interface program_tag_arr_rel_insert_input {
  data: program_tag_insert_input[];
  on_conflict?: program_tag_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_tag". All fields are combined with a logical 'AND'.
 */
export interface program_tag_bool_exp {
  _and?: (program_tag_bool_exp | null)[] | null;
  _not?: program_tag_bool_exp | null;
  _or?: (program_tag_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  program?: program_bool_exp | null;
  program_id?: uuid_comparison_exp | null;
  tag?: tag_bool_exp | null;
  tag_name?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_tag"
 */
export interface program_tag_insert_input {
  id?: any | null;
  position?: number | null;
  program?: program_obj_rel_insert_input | null;
  program_id?: any | null;
  tag?: tag_obj_rel_insert_input | null;
  tag_name?: string | null;
}

/**
 * on conflict condition type for table "program_tag"
 */
export interface program_tag_on_conflict {
  constraint: program_tag_constraint;
  update_columns: program_tag_update_column[];
  where?: program_tag_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "program_tempo_delivery"
 */
export interface program_tempo_delivery_arr_rel_insert_input {
  data: program_tempo_delivery_insert_input[];
  on_conflict?: program_tempo_delivery_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "program_tempo_delivery". All fields are combined with a logical 'AND'.
 */
export interface program_tempo_delivery_bool_exp {
  _and?: (program_tempo_delivery_bool_exp | null)[] | null;
  _not?: program_tempo_delivery_bool_exp | null;
  _or?: (program_tempo_delivery_bool_exp | null)[] | null;
  delivered_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  program_package_program?: program_package_program_bool_exp | null;
  program_package_program_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "program_tempo_delivery"
 */
export interface program_tempo_delivery_insert_input {
  delivered_at?: any | null;
  id?: any | null;
  member_id?: string | null;
  program_package_program?: program_package_program_obj_rel_insert_input | null;
  program_package_program_id?: any | null;
}

/**
 * on conflict condition type for table "program_tempo_delivery"
 */
export interface program_tempo_delivery_on_conflict {
  constraint: program_tempo_delivery_constraint;
  update_columns: program_tempo_delivery_update_column[];
  where?: program_tempo_delivery_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "project". All fields are combined with a logical 'AND'.
 */
export interface project_bool_exp {
  _and?: (project_bool_exp | null)[] | null;
  _not?: project_bool_exp | null;
  _or?: (project_bool_exp | null)[] | null;
  abstract?: String_comparison_exp | null;
  app_id?: String_comparison_exp | null;
  comments?: jsonb_comparison_exp | null;
  contents?: jsonb_comparison_exp | null;
  cover_type?: String_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  creator?: member_public_bool_exp | null;
  creator_id?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  expired_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  introduction?: String_comparison_exp | null;
  is_countdown_timer_visible?: Boolean_comparison_exp | null;
  is_participants_visible?: Boolean_comparison_exp | null;
  position?: Int_comparison_exp | null;
  preview_url?: String_comparison_exp | null;
  project_categories?: project_category_bool_exp | null;
  project_plans?: project_plan_bool_exp | null;
  project_sales?: project_sales_bool_exp | null;
  project_sections?: project_section_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  target_amount?: numeric_comparison_exp | null;
  target_unit?: String_comparison_exp | null;
  template?: String_comparison_exp | null;
  title?: String_comparison_exp | null;
  type?: String_comparison_exp | null;
  updates?: jsonb_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "project_category"
 */
export interface project_category_arr_rel_insert_input {
  data: project_category_insert_input[];
  on_conflict?: project_category_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "project_category". All fields are combined with a logical 'AND'.
 */
export interface project_category_bool_exp {
  _and?: (project_category_bool_exp | null)[] | null;
  _not?: project_category_bool_exp | null;
  _or?: (project_category_bool_exp | null)[] | null;
  category?: category_bool_exp | null;
  category_id?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  project?: project_bool_exp | null;
  project_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "project_category"
 */
export interface project_category_insert_input {
  category?: category_obj_rel_insert_input | null;
  category_id?: string | null;
  id?: any | null;
  position?: number | null;
  project?: project_obj_rel_insert_input | null;
  project_id?: any | null;
}

/**
 * on conflict condition type for table "project_category"
 */
export interface project_category_on_conflict {
  constraint: project_category_constraint;
  update_columns: project_category_update_column[];
  where?: project_category_bool_exp | null;
}

/**
 * input type for inserting data into table "project"
 */
export interface project_insert_input {
  abstract?: string | null;
  app_id?: string | null;
  comments?: any | null;
  contents?: any | null;
  cover_type?: string | null;
  cover_url?: string | null;
  created_at?: any | null;
  creator_id?: string | null;
  description?: string | null;
  expired_at?: any | null;
  id?: any | null;
  introduction?: string | null;
  is_countdown_timer_visible?: boolean | null;
  is_participants_visible?: boolean | null;
  position?: number | null;
  preview_url?: string | null;
  project_categories?: project_category_arr_rel_insert_input | null;
  project_plans?: project_plan_arr_rel_insert_input | null;
  project_sections?: project_section_arr_rel_insert_input | null;
  published_at?: any | null;
  target_amount?: any | null;
  target_unit?: string | null;
  template?: string | null;
  title?: string | null;
  type?: string | null;
  updates?: any | null;
}

/**
 * input type for inserting object relation for remote table "project"
 */
export interface project_obj_rel_insert_input {
  data: project_insert_input;
  on_conflict?: project_on_conflict | null;
}

/**
 * on conflict condition type for table "project"
 */
export interface project_on_conflict {
  constraint: project_constraint;
  update_columns: project_update_column[];
  where?: project_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "project_plan"
 */
export interface project_plan_arr_rel_insert_input {
  data: project_plan_insert_input[];
  on_conflict?: project_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "project_plan". All fields are combined with a logical 'AND'.
 */
export interface project_plan_bool_exp {
  _and?: (project_plan_bool_exp | null)[] | null;
  _not?: project_plan_bool_exp | null;
  _or?: (project_plan_bool_exp | null)[] | null;
  auto_renewed?: Boolean_comparison_exp | null;
  cover_url?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  deliverables?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  discount_down_price?: numeric_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  is_limited?: Boolean_comparison_exp | null;
  is_participants_visible?: Boolean_comparison_exp | null;
  is_physical?: Boolean_comparison_exp | null;
  is_subscription?: Boolean_comparison_exp | null;
  list_price?: numeric_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  period_amount?: numeric_comparison_exp | null;
  period_type?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  project?: project_bool_exp | null;
  project_id?: uuid_comparison_exp | null;
  project_plan_enrollments?: project_plan_enrollment_bool_exp | null;
  project_plan_inventory_status?: project_plan_inventory_status_bool_exp | null;
  published_at?: timestamptz_comparison_exp | null;
  sale_price?: numeric_comparison_exp | null;
  sold_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "project_plan_enrollment". All fields are combined with a logical 'AND'.
 */
export interface project_plan_enrollment_bool_exp {
  _and?: (project_plan_enrollment_bool_exp | null)[] | null;
  _not?: project_plan_enrollment_bool_exp | null;
  _or?: (project_plan_enrollment_bool_exp | null)[] | null;
  ended_at?: timestamptz_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  project_plan?: project_plan_bool_exp | null;
  project_plan_id?: uuid_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "project_plan"
 */
export interface project_plan_insert_input {
  auto_renewed?: boolean | null;
  cover_url?: string | null;
  created_at?: any | null;
  deliverables?: string | null;
  description?: string | null;
  discount_down_price?: any | null;
  id?: any | null;
  is_limited?: boolean | null;
  is_participants_visible?: boolean | null;
  is_physical?: boolean | null;
  is_subscription?: boolean | null;
  list_price?: any | null;
  options?: any | null;
  period_amount?: any | null;
  period_type?: string | null;
  position?: number | null;
  project?: project_obj_rel_insert_input | null;
  project_id?: any | null;
  published_at?: any | null;
  sale_price?: any | null;
  sold_at?: any | null;
  title?: string | null;
}

/**
 * Boolean expression to filter rows from the table "project_plan_inventory_status". All fields are combined with a logical 'AND'.
 */
export interface project_plan_inventory_status_bool_exp {
  _and?: (project_plan_inventory_status_bool_exp | null)[] | null;
  _not?: project_plan_inventory_status_bool_exp | null;
  _or?: (project_plan_inventory_status_bool_exp | null)[] | null;
  buyable_quantity?: bigint_comparison_exp | null;
  delivered_quantity?: bigint_comparison_exp | null;
  project_plan?: project_plan_bool_exp | null;
  project_plan_id?: uuid_comparison_exp | null;
  total_quantity?: bigint_comparison_exp | null;
  undelivered_quantity?: bigint_comparison_exp | null;
}

/**
 * on conflict condition type for table "project_plan"
 */
export interface project_plan_on_conflict {
  constraint: project_plan_constraint;
  update_columns: project_plan_update_column[];
  where?: project_plan_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "project_sales". All fields are combined with a logical 'AND'.
 */
export interface project_sales_bool_exp {
  _and?: (project_sales_bool_exp | null)[] | null;
  _not?: project_sales_bool_exp | null;
  _or?: (project_sales_bool_exp | null)[] | null;
  project?: project_bool_exp | null;
  project_id?: uuid_comparison_exp | null;
  total_sales?: numeric_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "project_section"
 */
export interface project_section_arr_rel_insert_input {
  data: project_section_insert_input[];
  on_conflict?: project_section_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "project_section". All fields are combined with a logical 'AND'.
 */
export interface project_section_bool_exp {
  _and?: (project_section_bool_exp | null)[] | null;
  _not?: project_section_bool_exp | null;
  _or?: (project_section_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  options?: jsonb_comparison_exp | null;
  position?: Int_comparison_exp | null;
  project?: project_bool_exp | null;
  project_id?: uuid_comparison_exp | null;
  type?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "project_section"
 */
export interface project_section_insert_input {
  id?: any | null;
  options?: any | null;
  position?: number | null;
  project?: project_obj_rel_insert_input | null;
  project_id?: any | null;
  type?: string | null;
}

/**
 * on conflict condition type for table "project_section"
 */
export interface project_section_on_conflict {
  constraint: project_section_constraint;
  update_columns: project_section_update_column[];
  where?: project_section_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "property"
 */
export interface property_arr_rel_insert_input {
  data: property_insert_input[];
  on_conflict?: property_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "property". All fields are combined with a logical 'AND'.
 */
export interface property_bool_exp {
  _and?: (property_bool_exp | null)[] | null;
  _not?: property_bool_exp | null;
  _or?: (property_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member_properties?: member_property_bool_exp | null;
  name?: String_comparison_exp | null;
  placeholder?: String_comparison_exp | null;
  position?: Int_comparison_exp | null;
  type?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "property"
 */
export interface property_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  created_at?: any | null;
  id?: any | null;
  member_properties?: member_property_arr_rel_insert_input | null;
  name?: string | null;
  placeholder?: string | null;
  position?: number | null;
  type?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "property"
 */
export interface property_obj_rel_insert_input {
  data: property_insert_input;
  on_conflict?: property_on_conflict | null;
}

/**
 * on conflict condition type for table "property"
 */
export interface property_on_conflict {
  constraint: property_constraint;
  update_columns: property_update_column[];
  where?: property_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "review"
 */
export interface review_arr_rel_insert_input {
  data: review_insert_input[];
  on_conflict?: review_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "review". All fields are combined with a logical 'AND'.
 */
export interface review_bool_exp {
  _and?: (review_bool_exp | null)[] | null;
  _not?: review_bool_exp | null;
  _or?: (review_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  path?: String_comparison_exp | null;
  private_content?: String_comparison_exp | null;
  review_replies?: review_reply_bool_exp | null;
  score?: numeric_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "review"
 */
export interface review_insert_input {
  app_id?: string | null;
  content?: string | null;
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  path?: string | null;
  private_content?: string | null;
  review_replies?: review_reply_arr_rel_insert_input | null;
  score?: any | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "review"
 */
export interface review_obj_rel_insert_input {
  data: review_insert_input;
  on_conflict?: review_on_conflict | null;
}

/**
 * on conflict condition type for table "review"
 */
export interface review_on_conflict {
  constraint: review_constraint;
  update_columns: review_update_column[];
  where?: review_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "review_public". All fields are combined with a logical 'AND'.
 */
export interface review_public_bool_exp {
  _and?: (review_public_bool_exp | null)[] | null;
  _not?: review_public_bool_exp | null;
  _or?: (review_public_bool_exp | null)[] | null;
  app_id?: String_comparison_exp | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  path?: String_comparison_exp | null;
  picture_url?: String_comparison_exp | null;
  review_replies?: review_reply_bool_exp | null;
  score?: numeric_comparison_exp | null;
  title?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
  username?: String_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "review_reply"
 */
export interface review_reply_arr_rel_insert_input {
  data: review_reply_insert_input[];
  on_conflict?: review_reply_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "review_reply". All fields are combined with a logical 'AND'.
 */
export interface review_reply_bool_exp {
  _and?: (review_reply_bool_exp | null)[] | null;
  _not?: review_reply_bool_exp | null;
  _or?: (review_reply_bool_exp | null)[] | null;
  content?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_public_bool_exp | null;
  member_id?: String_comparison_exp | null;
  review?: review_bool_exp | null;
  review_id?: uuid_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "review_reply"
 */
export interface review_reply_insert_input {
  content?: string | null;
  created_at?: any | null;
  id?: any | null;
  member_id?: string | null;
  review?: review_obj_rel_insert_input | null;
  review_id?: any | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "review_reply"
 */
export interface review_reply_on_conflict {
  constraint: review_reply_constraint;
  update_columns: review_reply_update_column[];
  where?: review_reply_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'.
 */
export interface role_bool_exp {
  _and?: (role_bool_exp | null)[] | null;
  _not?: role_bool_exp | null;
  _or?: (role_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  role_permissions?: role_permission_bool_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "role"
 */
export interface role_insert_input {
  created_at?: any | null;
  id?: string | null;
  name?: string | null;
  role_permissions?: role_permission_arr_rel_insert_input | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "role"
 */
export interface role_obj_rel_insert_input {
  data: role_insert_input;
  on_conflict?: role_on_conflict | null;
}

/**
 * on conflict condition type for table "role"
 */
export interface role_on_conflict {
  constraint: role_constraint;
  update_columns: role_update_column[];
  where?: role_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "role_permission"
 */
export interface role_permission_arr_rel_insert_input {
  data: role_permission_insert_input[];
  on_conflict?: role_permission_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "role_permission". All fields are combined with a logical 'AND'.
 */
export interface role_permission_bool_exp {
  _and?: (role_permission_bool_exp | null)[] | null;
  _not?: role_permission_bool_exp | null;
  _or?: (role_permission_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  permission?: permission_bool_exp | null;
  permission_id?: String_comparison_exp | null;
  role?: role_bool_exp | null;
  role_id?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "role_permission"
 */
export interface role_permission_insert_input {
  created_at?: any | null;
  id?: any | null;
  permission?: permission_obj_rel_insert_input | null;
  permission_id?: string | null;
  role?: role_obj_rel_insert_input | null;
  role_id?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "role_permission"
 */
export interface role_permission_on_conflict {
  constraint: role_permission_constraint;
  update_columns: role_permission_update_column[];
  where?: role_permission_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "sharing_code"
 */
export interface sharing_code_arr_rel_insert_input {
  data: sharing_code_insert_input[];
  on_conflict?: sharing_code_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "sharing_code". All fields are combined with a logical 'AND'.
 */
export interface sharing_code_bool_exp {
  _and?: (sharing_code_bool_exp | null)[] | null;
  _not?: sharing_code_bool_exp | null;
  _or?: (sharing_code_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  code?: String_comparison_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  note?: String_comparison_exp | null;
  path?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "sharing_code"
 */
export interface sharing_code_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  code?: string | null;
  created_at?: any | null;
  id?: any | null;
  note?: string | null;
  path?: string | null;
  updated_at?: any | null;
}

/**
 * on conflict condition type for table "sharing_code"
 */
export interface sharing_code_on_conflict {
  constraint: sharing_code_constraint;
  update_columns: sharing_code_update_column[];
  where?: sharing_code_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "social_card"
 */
export interface social_card_arr_rel_insert_input {
  data: social_card_insert_input[];
  on_conflict?: social_card_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "social_card". All fields are combined with a logical 'AND'.
 */
export interface social_card_bool_exp {
  _and?: (social_card_bool_exp | null)[] | null;
  _not?: social_card_bool_exp | null;
  _or?: (social_card_bool_exp | null)[] | null;
  badge_url?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member_social?: member_social_bool_exp | null;
  member_social_id?: uuid_comparison_exp | null;
  membership_id?: String_comparison_exp | null;
  name?: String_comparison_exp | null;
  social_card_subscribers?: social_card_subscriber_bool_exp | null;
}

/**
 * input type for inserting data into table "social_card"
 */
export interface social_card_insert_input {
  badge_url?: string | null;
  description?: string | null;
  id?: any | null;
  member_social?: member_social_obj_rel_insert_input | null;
  member_social_id?: any | null;
  membership_id?: string | null;
  name?: string | null;
  social_card_subscribers?: social_card_subscriber_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "social_card"
 */
export interface social_card_obj_rel_insert_input {
  data: social_card_insert_input;
  on_conflict?: social_card_on_conflict | null;
}

/**
 * on conflict condition type for table "social_card"
 */
export interface social_card_on_conflict {
  constraint: social_card_constraint;
  update_columns: social_card_update_column[];
  where?: social_card_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "social_card_subscriber"
 */
export interface social_card_subscriber_arr_rel_insert_input {
  data: social_card_subscriber_insert_input[];
  on_conflict?: social_card_subscriber_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "social_card_subscriber". All fields are combined with a logical 'AND'.
 */
export interface social_card_subscriber_bool_exp {
  _and?: (social_card_subscriber_bool_exp | null)[] | null;
  _not?: social_card_subscriber_bool_exp | null;
  _or?: (social_card_subscriber_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_channel_id?: String_comparison_exp | null;
  member_id?: String_comparison_exp | null;
  social_card?: social_card_bool_exp | null;
  social_card_id?: uuid_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "social_card_subscriber"
 */
export interface social_card_subscriber_insert_input {
  created_at?: any | null;
  ended_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_channel_id?: string | null;
  member_id?: string | null;
  social_card?: social_card_obj_rel_insert_input | null;
  social_card_id?: any | null;
  started_at?: any | null;
}

/**
 * on conflict condition type for table "social_card_subscriber"
 */
export interface social_card_subscriber_on_conflict {
  constraint: social_card_subscriber_constraint;
  update_columns: social_card_subscriber_update_column[];
  where?: social_card_subscriber_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'.
 */
export interface tag_bool_exp {
  _and?: (tag_bool_exp | null)[] | null;
  _not?: tag_bool_exp | null;
  _or?: (tag_bool_exp | null)[] | null;
  activity_tags?: activity_tag_bool_exp | null;
  created_at?: timestamptz_comparison_exp | null;
  member_specialities?: member_speciality_bool_exp | null;
  member_tags?: member_tag_bool_exp | null;
  merchandise_tags?: merchandise_tag_bool_exp | null;
  name?: String_comparison_exp | null;
  podcast_program_tags?: podcast_program_tag_bool_exp | null;
  post_tags?: post_tag_bool_exp | null;
  program_tags?: program_tag_bool_exp | null;
  type?: String_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "tag"
 */
export interface tag_insert_input {
  activity_tags?: activity_tag_arr_rel_insert_input | null;
  created_at?: any | null;
  member_specialities?: member_speciality_arr_rel_insert_input | null;
  member_tags?: member_tag_arr_rel_insert_input | null;
  merchandise_tags?: merchandise_tag_arr_rel_insert_input | null;
  name?: string | null;
  podcast_program_tags?: podcast_program_tag_arr_rel_insert_input | null;
  post_tags?: post_tag_arr_rel_insert_input | null;
  program_tags?: program_tag_arr_rel_insert_input | null;
  type?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "tag"
 */
export interface tag_obj_rel_insert_input {
  data: tag_insert_input;
  on_conflict?: tag_on_conflict | null;
}

/**
 * on conflict condition type for table "tag"
 */
export interface tag_on_conflict {
  constraint: tag_constraint;
  update_columns: tag_update_column[];
  where?: tag_bool_exp | null;
}

/**
 * expression to compare columns of type timestamptz. All fields are combined with logical 'AND'.
 */
export interface timestamptz_comparison_exp {
  _eq?: any | null;
  _gt?: any | null;
  _gte?: any | null;
  _in?: any[] | null;
  _is_null?: boolean | null;
  _lt?: any | null;
  _lte?: any | null;
  _neq?: any | null;
  _nin?: any[] | null;
}

/**
 * expression to compare columns of type uuid. All fields are combined with logical 'AND'.
 */
export interface uuid_comparison_exp {
  _eq?: any | null;
  _gt?: any | null;
  _gte?: any | null;
  _in?: any[] | null;
  _is_null?: boolean | null;
  _lt?: any | null;
  _lte?: any | null;
  _neq?: any | null;
  _nin?: any[] | null;
}

/**
 * input type for inserting array relation for remote table "voucher"
 */
export interface voucher_arr_rel_insert_input {
  data: voucher_insert_input[];
  on_conflict?: voucher_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "voucher". All fields are combined with a logical 'AND'.
 */
export interface voucher_bool_exp {
  _and?: (voucher_bool_exp | null)[] | null;
  _not?: voucher_bool_exp | null;
  _or?: (voucher_bool_exp | null)[] | null;
  created_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  status?: voucher_status_bool_exp | null;
  voucher_code?: voucher_code_bool_exp | null;
  voucher_code_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "voucher_code"
 */
export interface voucher_code_arr_rel_insert_input {
  data: voucher_code_insert_input[];
  on_conflict?: voucher_code_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "voucher_code". All fields are combined with a logical 'AND'.
 */
export interface voucher_code_bool_exp {
  _and?: (voucher_code_bool_exp | null)[] | null;
  _not?: voucher_code_bool_exp | null;
  _or?: (voucher_code_bool_exp | null)[] | null;
  code?: String_comparison_exp | null;
  count?: Int_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  remaining?: Int_comparison_exp | null;
  voucher_plan?: voucher_plan_bool_exp | null;
  voucher_plan_id?: uuid_comparison_exp | null;
  vouchers?: voucher_bool_exp | null;
}

/**
 * input type for inserting data into table "voucher_code"
 */
export interface voucher_code_insert_input {
  code?: string | null;
  count?: number | null;
  id?: any | null;
  remaining?: number | null;
  voucher_plan?: voucher_plan_obj_rel_insert_input | null;
  voucher_plan_id?: any | null;
  vouchers?: voucher_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "voucher_code"
 */
export interface voucher_code_obj_rel_insert_input {
  data: voucher_code_insert_input;
  on_conflict?: voucher_code_on_conflict | null;
}

/**
 * on conflict condition type for table "voucher_code"
 */
export interface voucher_code_on_conflict {
  constraint: voucher_code_constraint;
  update_columns: voucher_code_update_column[];
  where?: voucher_code_bool_exp | null;
}

/**
 * input type for inserting data into table "voucher"
 */
export interface voucher_insert_input {
  created_at?: any | null;
  id?: any | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  voucher_code?: voucher_code_obj_rel_insert_input | null;
  voucher_code_id?: any | null;
}

/**
 * on conflict condition type for table "voucher"
 */
export interface voucher_on_conflict {
  constraint: voucher_constraint;
  update_columns: voucher_update_column[];
  where?: voucher_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "voucher_plan"
 */
export interface voucher_plan_arr_rel_insert_input {
  data: voucher_plan_insert_input[];
  on_conflict?: voucher_plan_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "voucher_plan". All fields are combined with a logical 'AND'.
 */
export interface voucher_plan_bool_exp {
  _and?: (voucher_plan_bool_exp | null)[] | null;
  _not?: voucher_plan_bool_exp | null;
  _or?: (voucher_plan_bool_exp | null)[] | null;
  app?: app_bool_exp | null;
  app_id?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  ended_at?: timestamptz_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  product_quantity_limit?: Int_comparison_exp | null;
  started_at?: timestamptz_comparison_exp | null;
  title?: String_comparison_exp | null;
  voucher_codes?: voucher_code_bool_exp | null;
  voucher_plan_products?: voucher_plan_product_bool_exp | null;
}

/**
 * input type for inserting data into table "voucher_plan"
 */
export interface voucher_plan_insert_input {
  app?: app_obj_rel_insert_input | null;
  app_id?: string | null;
  description?: string | null;
  ended_at?: any | null;
  id?: any | null;
  product_quantity_limit?: number | null;
  started_at?: any | null;
  title?: string | null;
  voucher_codes?: voucher_code_arr_rel_insert_input | null;
  voucher_plan_products?: voucher_plan_product_arr_rel_insert_input | null;
}

/**
 * input type for inserting object relation for remote table "voucher_plan"
 */
export interface voucher_plan_obj_rel_insert_input {
  data: voucher_plan_insert_input;
  on_conflict?: voucher_plan_on_conflict | null;
}

/**
 * on conflict condition type for table "voucher_plan"
 */
export interface voucher_plan_on_conflict {
  constraint: voucher_plan_constraint;
  update_columns: voucher_plan_update_column[];
  where?: voucher_plan_bool_exp | null;
}

/**
 * input type for inserting array relation for remote table "voucher_plan_product"
 */
export interface voucher_plan_product_arr_rel_insert_input {
  data: voucher_plan_product_insert_input[];
  on_conflict?: voucher_plan_product_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "voucher_plan_product". All fields are combined with a logical 'AND'.
 */
export interface voucher_plan_product_bool_exp {
  _and?: (voucher_plan_product_bool_exp | null)[] | null;
  _not?: voucher_plan_product_bool_exp | null;
  _or?: (voucher_plan_product_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  product?: product_bool_exp | null;
  product_id?: String_comparison_exp | null;
  voucher_plan?: voucher_plan_bool_exp | null;
  voucher_plan_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "voucher_plan_product"
 */
export interface voucher_plan_product_insert_input {
  id?: any | null;
  product?: product_obj_rel_insert_input | null;
  product_id?: string | null;
  voucher_plan?: voucher_plan_obj_rel_insert_input | null;
  voucher_plan_id?: any | null;
}

/**
 * on conflict condition type for table "voucher_plan_product"
 */
export interface voucher_plan_product_on_conflict {
  constraint: voucher_plan_product_constraint;
  update_columns: voucher_plan_product_update_column[];
  where?: voucher_plan_product_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "voucher_status". All fields are combined with a logical 'AND'.
 */
export interface voucher_status_bool_exp {
  _and?: (voucher_status_bool_exp | null)[] | null;
  _not?: voucher_status_bool_exp | null;
  _or?: (voucher_status_bool_exp | null)[] | null;
  outdated?: Boolean_comparison_exp | null;
  used?: Boolean_comparison_exp | null;
  voucher?: voucher_bool_exp | null;
  voucher_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting array relation for remote table "xuemi.assign_rule"
 */
export interface xuemi_assign_rule_arr_rel_insert_input {
  data: xuemi_assign_rule_insert_input[];
  on_conflict?: xuemi_assign_rule_on_conflict | null;
}

/**
 * Boolean expression to filter rows from the table "xuemi.assign_rule". All fields are combined with a logical 'AND'.
 */
export interface xuemi_assign_rule_bool_exp {
  _and?: (xuemi_assign_rule_bool_exp | null)[] | null;
  _not?: xuemi_assign_rule_bool_exp | null;
  _or?: (xuemi_assign_rule_bool_exp | null)[] | null;
  id?: uuid_comparison_exp | null;
  limit?: Int_comparison_exp | null;
  manager_status?: xuemi_manager_status_bool_exp | null;
  member?: member_bool_exp | null;
  member_id?: String_comparison_exp | null;
  member_selector?: xuemi_member_selector_bool_exp | null;
  member_selector_id?: uuid_comparison_exp | null;
  position?: Int_comparison_exp | null;
  source_member?: member_bool_exp | null;
  source_member_id?: String_comparison_exp | null;
  status?: xuemi_assign_rule_status_bool_exp | null;
  target_member?: member_bool_exp | null;
  target_member_id?: String_comparison_exp | null;
  target_member_status?: xuemi_manager_status_bool_exp | null;
  total_limit?: Int_comparison_exp | null;
  trigger?: xuemi_trigger_bool_exp | null;
  trigger_id?: uuid_comparison_exp | null;
}

/**
 * input type for inserting data into table "xuemi.assign_rule"
 */
export interface xuemi_assign_rule_insert_input {
  id?: any | null;
  limit?: number | null;
  member?: member_obj_rel_insert_input | null;
  member_id?: string | null;
  member_selector?: xuemi_member_selector_obj_rel_insert_input | null;
  member_selector_id?: any | null;
  position?: number | null;
  source_member?: member_obj_rel_insert_input | null;
  source_member_id?: string | null;
  status?: xuemi_assign_rule_status_obj_rel_insert_input | null;
  target_member?: member_obj_rel_insert_input | null;
  target_member_id?: string | null;
  total_limit?: number | null;
  trigger?: xuemi_trigger_obj_rel_insert_input | null;
  trigger_id?: any | null;
}

/**
 * on conflict condition type for table "xuemi.assign_rule"
 */
export interface xuemi_assign_rule_on_conflict {
  constraint: xuemi_assign_rule_constraint;
  update_columns: xuemi_assign_rule_update_column[];
  where?: xuemi_assign_rule_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "xuemi.assign_rule_status". All fields are combined with a logical 'AND'.
 */
export interface xuemi_assign_rule_status_bool_exp {
  _and?: (xuemi_assign_rule_status_bool_exp | null)[] | null;
  _not?: xuemi_assign_rule_status_bool_exp | null;
  _or?: (xuemi_assign_rule_status_bool_exp | null)[] | null;
  assign_rule_id?: uuid_comparison_exp | null;
  matched?: Boolean_comparison_exp | null;
  remaining?: bigint_comparison_exp | null;
  updated_at?: timestamptz_comparison_exp | null;
}

/**
 * input type for inserting data into table "xuemi.assign_rule_status"
 */
export interface xuemi_assign_rule_status_insert_input {
  assign_rule_id?: any | null;
  matched?: boolean | null;
  remaining?: any | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "xuemi.assign_rule_status"
 */
export interface xuemi_assign_rule_status_obj_rel_insert_input {
  data: xuemi_assign_rule_status_insert_input;
}

/**
 * Boolean expression to filter rows from the table "xuemi.manager_status". All fields are combined with a logical 'AND'.
 */
export interface xuemi_manager_status_bool_exp {
  _and?: (xuemi_manager_status_bool_exp | null)[] | null;
  _not?: xuemi_manager_status_bool_exp | null;
  _or?: (xuemi_manager_status_bool_exp | null)[] | null;
  assigned?: bigint_comparison_exp | null;
  category_name?: String_comparison_exp | null;
  limit?: Int_comparison_exp | null;
  manager_id?: String_comparison_exp | null;
  remaining?: Int_comparison_exp | null;
}

/**
 * Boolean expression to filter rows from the table "xuemi.member_selector". All fields are combined with a logical 'AND'.
 */
export interface xuemi_member_selector_bool_exp {
  _and?: (xuemi_member_selector_bool_exp | null)[] | null;
  _not?: xuemi_member_selector_bool_exp | null;
  _or?: (xuemi_member_selector_bool_exp | null)[] | null;
  assign_rules?: xuemi_assign_rule_bool_exp | null;
  condition?: jsonb_comparison_exp | null;
  description?: String_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "xuemi.member_selector"
 */
export interface xuemi_member_selector_insert_input {
  assign_rules?: xuemi_assign_rule_arr_rel_insert_input | null;
  condition?: any | null;
  description?: string | null;
  id?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "xuemi.member_selector"
 */
export interface xuemi_member_selector_obj_rel_insert_input {
  data: xuemi_member_selector_insert_input;
  on_conflict?: xuemi_member_selector_on_conflict | null;
}

/**
 * on conflict condition type for table "xuemi.member_selector"
 */
export interface xuemi_member_selector_on_conflict {
  constraint: xuemi_member_selector_constraint;
  update_columns: xuemi_member_selector_update_column[];
  where?: xuemi_member_selector_bool_exp | null;
}

/**
 * Boolean expression to filter rows from the table "xuemi.trigger". All fields are combined with a logical 'AND'.
 */
export interface xuemi_trigger_bool_exp {
  _and?: (xuemi_trigger_bool_exp | null)[] | null;
  _not?: xuemi_trigger_bool_exp | null;
  _or?: (xuemi_trigger_bool_exp | null)[] | null;
  assign_rules?: xuemi_assign_rule_bool_exp | null;
  condition?: String_comparison_exp | null;
  description?: String_comparison_exp | null;
  duration?: numeric_comparison_exp | null;
  id?: uuid_comparison_exp | null;
  title?: String_comparison_exp | null;
}

/**
 * input type for inserting data into table "xuemi.trigger"
 */
export interface xuemi_trigger_insert_input {
  assign_rules?: xuemi_assign_rule_arr_rel_insert_input | null;
  condition?: string | null;
  description?: string | null;
  duration?: any | null;
  id?: any | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "xuemi.trigger"
 */
export interface xuemi_trigger_obj_rel_insert_input {
  data: xuemi_trigger_insert_input;
  on_conflict?: xuemi_trigger_on_conflict | null;
}

/**
 * on conflict condition type for table "xuemi.trigger"
 */
export interface xuemi_trigger_on_conflict {
  constraint: xuemi_trigger_constraint;
  update_columns: xuemi_trigger_update_column[];
  where?: xuemi_trigger_bool_exp | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
