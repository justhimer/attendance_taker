import { PrismaClient, AcceptanceStatus } from '@prisma/client';
import { hashPasswordBcrypt } from 'src/utils/security/bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.users.create({
    data: {
      email: 'justin01@abc.com',
      username: 'Justin',
      password: await hashPasswordBcrypt('123456'),
      phone: '1234567890',
    },
  });

  const user2 = await prisma.users.create({
    data: {
      email: 'anna@abc.com',
      username: 'Anna',
      password: await hashPasswordBcrypt('123456'),
      phone: '0987654321',
    },
  });

  const user3 = await prisma.users.create({
    data: {
      email: 'michael@xyz.com',
      username: 'Michael',
      password: await hashPasswordBcrypt('123456'),
      phone: '1122334455',
    },
  });

  const user4 = await prisma.users.create({
    data: {
      email: 'sarah@xyz.com',
      username: 'Sarah',
      password: await hashPasswordBcrypt('123456'),
      phone: '5566778899',
    },
  });

  const event1 = await prisma.events.create({
    data: {
      hosted_by: user1.id,
      title: 'Annual Tech Conference',
      start: new Date('2024-05-15T09:00:00'),
      end: new Date('2024-05-15T18:00:00'),
      venue: 'Hong Kong Convention and Exhibition Centre',
      details: 'Join us for a day of insightful talks and networking with industry leaders.',
    },
  });

  const event2 = await prisma.events.create({
    data: {
      hosted_by: user2.id,
      title: 'Art Exhibition',
      start: new Date('2024-05-16T10:00:00'),
      end: new Date('2024-05-16T16:00:00'),
      venue: 'Hong Kong Museum of Art',
      details: 'Experience the best of contemporary art at our annual exhibition.',
    },
  });

  const event3 = await prisma.events.create({
    data: {
      hosted_by: user3.id,
      title: 'Startup Pitch Event',
      start: new Date('2024-05-20T10:00:00'),
      end: new Date('2024-05-20T16:00:00'),
      venue: 'Cyberport, Hong Kong',
      details: 'Come and pitch your innovative ideas to investors.',
    },
  });

  const event4 = await prisma.events.create({
    data: {
      hosted_by: user4.id,
      title: 'Charity Run',
      start: new Date('2024-05-01T07:00:00'),
      end: new Date('2024-05-01T11:00:00'),
      venue: 'Victoria Park, Hong Kong',
      details: 'Join us for a charity run to raise funds for a good cause.',
    },
  });

  await prisma.attendance.create({
    data: {
      user_id: user2.id,
      event_id: event1.id,
      attend_time: new Date('2024-05-15T09:30:00'),
    },
  });

  await prisma.attendance.create({
    data: {
      user_id: user1.id,
      event_id: event2.id,
      attend_time: new Date('2024-05-16T10:30:00'),
    },
  });

  await prisma.attendance.create({
    data: {
      user_id: user4.id,
      event_id: event3.id,
      attend_time: new Date('2024-05-20T10:30:00'),
    },
  });

  await prisma.attendance.create({
    data: {
      user_id: user3.id,
      event_id: event4.id,
      attend_time: new Date('2024-05-01T07:30:00'),
    },
  });

  await prisma.invitations.create({
    data: {
      event_id: event1.id,
      user_id: user2.id,
      status: AcceptanceStatus.ACCEPTED,
    },
  });

  await prisma.invitations.create({
    data: {
      event_id: event2.id,
      user_id: user1.id,
      status: AcceptanceStatus.ACCEPTED,
    },
  });

  await prisma.invitations.create({
    data: {
      event_id: event3.id,
      user_id: user4.id,
      status: AcceptanceStatus.ACCEPTED,
    },
  });

  await prisma.invitations.create({
    data: {
      event_id: event4.id,
      user_id: user3.id,
      status: AcceptanceStatus.ACCEPTED,
    },
  });

  await prisma.contacts.create({
    data: {
      user_id: user1.id,
      contact_id: user2.id,
    },
  });

  await prisma.contacts.create({
    data: {
      user_id: user3.id,
      contact_id: user4.id,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
