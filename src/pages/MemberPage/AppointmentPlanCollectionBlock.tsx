import { SkeletonText } from '@chakra-ui/react'
import { List } from 'antd'
import React from 'react'
import AppointmentCard from '../../components/appointment/AppointmentCard'
import { useEnrolledAppointmentCollection } from '../../hooks/appointment'

const AppointmentPlanCollectionBlock: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { loadingEnrolledAppointments, enrolledAppointments, refetchEnrolledAppointments } =
    useEnrolledAppointmentCollection(memberId)

  if (loadingEnrolledAppointments) {
    return (
      <div className="container py-3">
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  return (
    <div className="container py-3">
      <List>
        {enrolledAppointments.map(appointmentEnrollment => (
          <div key={appointmentEnrollment.orderProductId} className="mb-4">
            <AppointmentCard {...appointmentEnrollment} onRefetch={refetchEnrolledAppointments} />
          </div>
        ))}
      </List>
    </div>
  )
}

export default AppointmentPlanCollectionBlock
