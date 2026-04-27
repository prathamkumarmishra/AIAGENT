const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
// We use the GOOGLE_GEMINI_API_KEY environment variable. If not set, it will fail when called.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "");

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

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
  const prompt = `You are an expert outdoor adventure planner assistant. Help users plan their outdoor adventures, give safety tips, suggest gear, and provide destination information.
  
${context ? `Context: ${context}` : ""}

User: ${userMessage}

Provide a helpful, concise response focused on outdoor adventure planning.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { generateAdventureItinerary, generateChatResponse };
