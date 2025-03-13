export type Turtle = {
  id: string
  title: string
  image: string
  dateRescued: string
  turtleLength: number
  turtleWeight: number
  locationRescued: string
  status: string
}

export const turtleData: Turtle[] = [
  {
    id: "1",
    title: "Green Turtle",
    image:
      "https://media.australian.museum/media/dd/images/1600px-Green_Turtle_Chelonia_mydas_6133097542.width-1200.c1df197.jpg",
    dateRescued: "2024-02-15",
    turtleLength: 85,
    turtleWeight: 150,
    locationRescued: "Boracay, Philippines",
    status: "Under rehabilitation",
  },
  {
    id: "2",
    title: "Hawksbill Turtle",
    image:
      "https://www.fisheries.noaa.gov/s3//styles/full_width/s3/dam-migration/hawksbill_sea_turtle.jpg?itok=cxzcge8K",
    dateRescued: "2024-03-02",
    turtleLength: 75,
    turtleWeight: 80,
    locationRescued: "Tubbataha Reefs, Philippines",
    status: "Recovering from plastic ingestion",
  },
  {
    id: "3",
    title: "Olive Ridley Turtle",
    image:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTmYR1WtV9uhDlhowwqK-TOUI0tX9jlhVWN7YO9ZaBemHkdskICPaVlTr1yBqPxrpLdJtwssyNoUjRQdQOe34LJBA",
    dateRescued: "2024-01-28",
    turtleLength: 65,
    turtleWeight: 45,
    locationRescued: "Baler, Philippines",
    status: "Minor injuries, stable condition",
  },
  {
    id: "4",
    title: "Leatherback Turtle",
    image:
      "https://www.boem.gov/sites/default/files/styles/max_width_600px/public/images/leatherback_turtle_photo_credit_noaa_fisheries.jpg?itok=i7yPTVpw",
    dateRescued: "2024-02-10",
    turtleLength: 200,
    turtleWeight: 600,
    locationRescued: "Palawan, Philippines",
    status: "Released after net entanglement rescue",
  },
  {
    id: "5",
    title: "Loggerhead Turtle",
    image:
      "https://www.2fla.com/sites/default/files/loggerhead-001-adolfo-felix-BXN16VVFEio-unsplash.jpg",
    dateRescued: "2024-03-05",
    turtleLength: 90,
    turtleWeight: 120,
    locationRescued: "Cebu, Philippines",
    status: "Being monitored for health concerns",
  },
]
