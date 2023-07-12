import { Appointment } from "../entities/appointment";
import {AppointmentsRepository} from '../repositories/appointment-repository'

interface CreateAppointmentRequest {
    costumer: string;
    startsAt: Date;
    endsAt: Date;
}

type CreateAppointmentResponse = Appointment;

export class CreateAppointment {
    constructor(
        private appointmentsRepository: AppointmentsRepository
    ) {}

    async execute({
        costumer,
        startsAt,
        endsAt,
    }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
        const overLappingAppointment = await this.appointmentsRepository.findOverLappingAppointment(
            startsAt,
            endsAt
        )

        if(overLappingAppointment) {
            throw new Error('Another appointment overlapps this appointment dates')
        }

        const appointment = new Appointment({
            costumer,
            startsAt,
            endsAt,
        });

        await this.appointmentsRepository.create(appointment)

        return appointment;
    }
}
