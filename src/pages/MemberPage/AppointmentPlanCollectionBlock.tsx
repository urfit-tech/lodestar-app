import { List } from 'antd'
import React from 'react'
import AppointmentCard from '../../components/appointment/AppointmentCard'
import { useEnrolledAppointmentCollection } from '../../hooks/appointment'

const AppointmentPlanCollectionBlock: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { enrolledAppointments, refetchEnrolledAppointments } = useEnrolledAppointmentCollection(memberId)

  return (
    <div className="container py-3">
      <List>
        {enrolledAppointments.map(appointmentEnrollment => (
          <div key={appointmentEnrollment.orderProduct.id} className="mb-4">
            <AppointmentCard {...appointmentEnrollment} onRefetch={refetchEnrolledAppointments} />
          </div>
        ))}
      </List>
    </div>
  )
}

export default AppointmentPlanCollectionBlock
