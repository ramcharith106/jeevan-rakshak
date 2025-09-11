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
    },
    {
        question: "Myth: It takes a long time to donate blood.",
        answer: "Fact: The entire process, including registration, a mini-health check, donation, and refreshments, takes about an hour. The actual blood donation part only takes about 8-10 minutes."
    }
];

export default function Learn() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Be a Knowledgeable Donor
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Understanding the process and impact of blood donation.
        </p>

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
                    <li><strong>Pulse:</strong> Between 50 and 100 beats/minute with no irregularities.</li>
                    <li><strong>Hemoglobin:</strong> At least 12.5 g/dL.</li>
                    <li><strong>Donation Interval:</strong> At least 3 months since your last whole blood donation.</li>
                </ul>
            </CardContent>
        </Card>

        {/* Benefits Section */}
         <Card className="mb-8">
            <CardHeader>
                <CardTitle>The Impact of Your Donation</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Saves Lives:</strong> A single donation can save up to three lives.</li>
                    <li><strong>Supports Various Needs:</strong> Blood is crucial for surgeries, cancer treatments, chronic illnesses, and traumatic injuries.</li>
                    <li><strong>Health Benefits for Donors:</strong> Donating can help reduce harmful iron stores and may lower the risk of heart disease and cancer.</li>
                    <li><strong>Free Health Check-up:</strong> You get a mini-physical, which checks your pulse, blood pressure, body temperature, and hemoglobin levels.</li>
                </ul>
            </CardContent>
        </Card>


        {/* Myth Busting Section */}
        <div>
            <h2 className="text-3xl font-bold text-center mb-6">Myths vs. Facts</h2>
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
  );
}