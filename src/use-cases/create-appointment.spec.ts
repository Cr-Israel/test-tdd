import { describe, expect, it } from "vitest";
import { CreateAppointment } from "./create-appointment";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
describe("Create Appointment", () => {
    it("should be able to create an appointment", () => {
        const startsAt = getFutureDate("2023-08-10");
        const endsAt = getFutureDate("2023-08-11");

        const appointmentsRepository = new InMemoryAppointmentsRepository();
        const createAppointment = new CreateAppointment(
            appointmentsRepository
        );

        expect(
            createAppointment.execute({
                costumer: "John Doe",
                startsAt,
                endsAt,
            })
        ).resolves.toBeInstanceOf(Appointment);
    });

    it("should be not able to create an appointment with overlapping dates", async () => {
        const startsAt = getFutureDate("2023-08-10");
        const endsAt = getFutureDate("2023-08-15");

        const appointmentsRepository = new InMemoryAppointmentsRepository();
        const createAppointment = new CreateAppointment(
            appointmentsRepository
        );

        await createAppointment.execute({
            costumer: "John Doe",
            startsAt,
            endsAt,
        })

        expect(createAppointment.execute({
            costumer: 'John Doe',
            startsAt: getFutureDate("2023-08-14"),
            endsAt: getFutureDate("2023-08-18")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            costumer: 'John Doe',
            startsAt: getFutureDate("2023-08-08"),
            endsAt: getFutureDate("2023-08-12")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            costumer: 'John Doe',
            startsAt: getFutureDate("2023-08-08"),
            endsAt: getFutureDate("2023-08-17")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            costumer: 'John Doe',
            startsAt: getFutureDate("2023-08-11"),
            endsAt: getFutureDate("2023-08-12")
        })).rejects.toBeInstanceOf(Error)
    });
});
