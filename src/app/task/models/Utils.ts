export type GUID = string & { isGuid: true };

function isGuid(guidCandidate: any): guidCandidate is GUID {
  return (
    typeof guidCandidate === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      guidCandidate
    )
  );
}

// export interface GuidType {
//   isGuid: true;
//   value: string;
// }

// function processGuid(guid: any) {
//   if (isGuid(guid)) {
//     console.log(guid.value); // Now, TypeScript knows that guid is a valid GUID and has a value property.
//   } else {
//     console.log('Not a valid GUID.');
//   }
// }

export enum STATUS {
  Pending,
  Completed,
}

export enum PRIORITY {
  Low,
  Medium,
  High,
}

export enum CATEGORY {
  Bucket_List, //: Skydiving, traveling to a specific destination, learning a new language.
  Car, //: Getting an oil change, washing the car, filling up with gas.
  Creativity, //: Art projects, writing, music, crafts, etc.
  Daily_Routine, //: Morning yoga, evening skincare routine, weekly meal planning.
  Errands, //: Grocery shopping, picking up kids, mailing a package.
  Event, //: Planning a birthday party, attending a wedding, organizing a conference.
  Environmental, //: Recycling, sustainability efforts, eco-friendly practices, etc.
  Family, //: Family events, quality time with family members, parenting tasks, etc.
  Finance, //: Creating a budget, paying off credit card debt, investing in stocks.
  Finance_Management, //: Budgeting, savings goals, financial planning, etc.
  Fitness, //: Running a marathon, attending a yoga class, workouts, gym sessions, etc.
  Gardening, //: Tending to plants, gardening tasks, outdoor maintenance, etc.
  General, //: Sending emails, organizing files, paying bills, or any activity.
  Goal, //: Setting SMART goals, tracking progress, celebrating achievements.
  Health, //: Meditation, Going for a run, meal prepping, scheduling a doctor's appointment.
  Hobbies, //: Painting a picture, playing a musical instrument, gardening.
  Home, //: Vacuuming, laundry, cooking, cleaning, repairs, maintenance tasks, etc.
  Learning, //: Courses, self-study, educational activities, etc.
  Meal_Planning, //: Planning meals, grocery shopping, cooking, etc.
  Personal, //: Self-improvement activities, reading a book, setting personal goals, etc.
  Pets, //: Taking care of pets, grooming, vet appointments, etc.
  Productivity, //: Time management, organization, task prioritization, etc.
  Self_care, //: Skincare, relaxation techniques, meditation, etc.
  Shopping, //: Buying groceries, purchasing clothes, ordering household items online.
  Social, //: Meeting friends for coffee, attending a party, calling a family member.
  Socializing, //: Meeting friends, social events, networking, etc.
  Spiritual, //: Meditation, prayer, religious activities, etc.
  Study, //: Studying for exams, completing homework assignments, attending lectures.
  Travel, //: Booking flights, packing luggage, researching local attractions.
  Volunteering, //: Serving meals at a homeless shelter, cleaning up a local park, participating in a charity run.
  Work, //: Attending meetings, writing reports, completing projects.
}
