interface Risk {
    category: string;
    riskLevel: string;
    clause: string;
    explanation: string;
}

export default function RiskCard({ risk }: { risk: Risk }) {
    const color =
        risk.riskLevel === "High"
        ? "bg-red-100 border-red-400"
        : risk.riskLevel === "Medium"
        ? "bg-yellow-100 border-yellow-400"
        : "bg-green-100 border-green-400";

    return (
        <div className={`border-l-4 p-5 rounded-xl ${color}`}>
        <h3 className="font-semibold text-lg">
            {risk.category} — {risk.riskLevel} Risk
        </h3>
            <p className="mt-2 text-sm italic">{risk.clause}</p>
            <p className="mt-2">{risk.explanation}</p>
        </div>
    );
}


