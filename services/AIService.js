const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Choice } = require("../models");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateChoices(question) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not found in environment variables.");
        return [];
      }

      console.log(`Generating choices for question ID: ${question.id}`);
      
      const existingChoices = question.choices || [];
      const choiceTexts = existingChoices.map(c => `- ${c.choiceText}${c.isCorrect ? ' (Correct)' : ''}`).join('\n');

      const prompt = `
        You are an educational assistant. I have a multiple-choice question that is missing options or has too few options.
        Please provide a total of 4 suitable options (including the correct one if already provided) for this question.
        
        Question: ${question.questionText}
        
        Current choices/info:
        ${choiceTexts}
        
        If a correct answer is already provided above, use it and generate 3 plausible distractors.
        If no correct answer is provided, identify the correct one and generate 3 distractors.
        
        Return the result as a JSON array of objects, where each object has "text" (the choice string) and "isCorrect" (boolean).
        Example format:
        [
          {"text": "Oxygen", "isCorrect": true},
          {"text": "Nitrogen", "isCorrect": false},
          {"text": "Carbon", "isCorrect": false},
          {"text": "Hydrogen", "isCorrect": false}
        ]
        
        Provide only the JSON array.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response (handling potential markdown blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse AI response as JSON");
      }

      const generatedChoices = JSON.parse(jsonMatch[0]);

      // Save generated choices to database
      const savedChoices = [];
      for (let i = 0; i < generatedChoices.length; i++) {
        const choiceData = generatedChoices[i];
        
        // Skip if this choice already exists (basic string match to avoid duplicates)
        const isDuplicate = existingChoices.some(ec => 
          ec.choiceText.toLowerCase().trim() === choiceData.text.toLowerCase().trim()
        );
        
        if (!isDuplicate) {
          const choice = await Choice.create({
            choiceText: choiceData.text,
            isCorrect: choiceData.isCorrect,
            questionId: question.id,
            orderNumber: existingChoices.length + i
          });
          savedChoices.push(choice);
        }
      }

      return savedChoices;
    } catch (error) {
      console.error("AI Choice Generation Error:", error);
      return [];
    }
  }
}

module.exports = new AIService();
