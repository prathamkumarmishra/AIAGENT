const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const normalizeActivities = (activities) => {
  if (Array.isArray(activities) && activities.length > 0) return activities;
  if (typeof activities === "string" && activities.trim()) {
    return activities.split(",").map((activity) => activity.trim()).filter(Boolean);
  }
  return ["Trekking", "Camping", "Nature Walk"];
};

const createDemoItinerary = ({ location, budget, days, activities }) => {
  const activityList = normalizeActivities(activities);
  const totalDays = Number.isInteger(days) && days > 0 ? days : 1;

  return {
    title: `${location} Outdoor Adventure`,
    location,
    total_estimated_cost: `INR ${budget}`,
    best_time_to_visit: "Plan around clear weather and avoid heavy rain alerts.",
    days: Array.from({ length: totalDays }, (_, index) => ({
      day: index + 1,
      plan:
        index === 0
          ? `Arrive in ${location}, settle in, and take a short orientation walk before your first activity.`
          : `Continue the trip with a balanced mix of ${activityList.join(", ")} and recovery time.`,
      activities: activityList.slice(0, 3),
      cost: `INR ${Math.ceil(Number(budget) / totalDays) || budget}`,
    })),
    activities: activityList,
    packing_list: [
      "Reusable water bottle",
      "Weather-appropriate layers",
      "First aid kit",
      "Navigation backup",
      "Trail snacks",
    ],
    safety_tips: [
      "Check local weather before starting each activity.",
      "Share your route and expected return time with someone you trust.",
      "Use licensed local guides for technical or remote routes.",
    ],
    highlights: [`Outdoor activities near ${location}`, "Flexible demo itinerary"],
    difficulty_level: "Moderate",
    fitness_required: "Basic endurance for walking and light outdoor activity.",
    demo: true,
  };
};

/**
 * Generate outdoor adventure itinerary using Gemini AI
 */
const generateAdventureItinerary = async ({
  location,
  budget,
  days,
  activities,
}) => {
  const activitiesList = Array.isArray(activities)
    ? activities.join(", ")
    : activities;

  const parsedDays = Number.parseInt(days, 10);

  if (!genAI) {
    return createDemoItinerary({
      location,
      budget,
      days: parsedDays,
      activities,
    });
  }

  const prompt = `You are an expert outdoor adventure planner. Create a detailed outdoor adventure itinerary based on:
Location: ${location}
Budget: ${budget} (INR)
Duration: ${days} days
Interests: ${activitiesList}

Instructions:
- Suggest 3-5 suitable outdoor activities (trekking, camping, cycling, etc.)
- Provide a day-wise itinerary
- Include estimated cost breakdown (travel, food, stay, activities)
- Mention best time to visit
- Include safety tips and precautions
- Suggest required gear/items
- Consider weather conditions

Return ONLY a valid JSON object (no markdown, no backticks, no extra text) with this exact structure:
{
  "title": "Adventure trip title",
  "location": "${location}",
  "total_estimated_cost": "₹X,XXX",
  "best_time_to_visit": "Month range and conditions",
  "days": [
    {
      "day": 1,
      "plan": "Detailed plan description",
      "activities": ["Activity 1", "Activity 2"],
      "cost": "₹X,XXX"
    }
  ],
  "activities": ["Activity 1", "Activity 2", "Activity 3"],
  "packing_list": ["Item 1", "Item 2", "Item 3"],
  "safety_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "highlights": ["Highlight 1", "Highlight 2"],
  "difficulty_level": "Easy/Moderate/Hard",
  "fitness_required": "Description of fitness level needed"
}`;

  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Parse JSON response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
};

/**
 * Generate AI chatbot response
 */
const generateChatResponse = async (userMessage, context = "") => {
  if (!genAI) {
    return "I can help with destination ideas, packing, safety, budget planning, and day-wise adventure routes. Add a Gemini API key for live AI responses.";
  }

  const prompt = `You are an expert outdoor adventure planner assistant. Help users plan their outdoor adventures, give safety tips, suggest gear, and provide destination information.
  
${context ? `Context: ${context}` : ""}

User: ${userMessage}

Provide a helpful, concise response focused on outdoor adventure planning.`;

  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { generateAdventureItinerary, generateChatResponse };
