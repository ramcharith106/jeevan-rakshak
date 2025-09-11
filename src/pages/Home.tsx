import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const myths = [
    {
        question: "Myth: Donating blood is painful.",
        answer: "Fact: The only pain you'll feel is a quick, slight pinch from the needle, similar to a regular injection. The discomfort is minimal and temporary."
    },
    {
        question: "Myth: I will feel weak and tired after donating blood.",
        answer: "Fact: Most donors feel fine after resting for a short period and having refreshments. Your body replaces the donated blood volume within 24-48 hours. It's important to be well-hydrated before donating."
    },
    {
        question: "Myth: I can't donate because I have high blood pressure or diabetes.",
        answer: "Fact: You can donate blood if your blood pressure is under control (below 180/100 mmHg) at the time of donation. Diabetics can also donate if their condition is managed through diet or oral medication, and their blood sugar is under control."
    },
    {
        question: "Myth: Donating blood can lead to infections like HIV.",
        answer: "Fact: This is impossible. A brand new, sterile, single-use needle is used for every donor and is properly discarded afterward. There is no risk of contracting any blood-borne disease."
    }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="text-center py-20 px-4 bg-gradient-to-r from-red-50 via-blue-50 to-red-50">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
          Be a Lifesaver. Donate Blood.
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
          Join our community of voluntary blood donors. Your contribution can save up to three lives. Find requests, respond in minutes, and make a real difference.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate("/donate")}
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
          >
            🩸 Find a Request
          </Button>
          <Button
            onClick={() => navigate("/request")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
          >
            ➕ Post a Request
          </Button>
        </div>
      </div>

       {/* Educational Section */}
       <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-12">
                Learn About Donation
            </h2>

            {/* Eligibility Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Are You Eligible to Donate?</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Age:</strong> 18-65 years.</li>
                        <li><strong>Weight:</strong> At least 50 kg (110 lbs).</li>
                        <li><strong>Health:</strong> You must be in good health and feeling well on the day of donation.</li>
                        <li><strong>Hemoglobin:</strong> At least 12.5 g/dL.</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Myth Busting Section */}
            <div>
                <h3 className="text-3xl font-bold text-center mb-6">Myths vs. Facts</h3>
                <Accordion type="single" collapsible className="w-full">
                    {myths.map((myth, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left font-semibold">{myth.question}</AccordionTrigger>
                            <AccordionContent className="text-gray-700">
                                {myth.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
       </div>
    </div>
  );
}