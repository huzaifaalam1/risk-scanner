interface Risk {
    category: string;
    riskLevel: string;
    clause: string;
    explanation: string;
}


interface Props {
    risks: Risk[];
}


export default function RiskSummary({ risks }: Props) {
    if (!risks || risks.length === 0) return null;


    const high = risks.filter(r => r.riskLevel === "High").length;
    const medium = risks.filter(r => r.riskLevel === "Medium").length;
    const low = risks.filter(r => r.riskLevel === "Low").length;


    const overallRisk =
    high > 0 ? "High Risk" :
    medium > 0 ? "Medium Risk" :
    "Low Risk";


    return (
    <div className="p-6 bg-zinc-100 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
        Overall Contract Risk: {overallRisk}
        </h2>


        <div className="flex gap-6">
        <div>
            <p className="text-red-600 font-bold text-lg">{high}</p>
            <p>High Risks</p>
        </div>


        <div>
            <p className="text-yellow-600 font-bold text-lg">{medium}</p>
            <p>Medium Risks</p>
        </div>


        <div>
            <p className="text-green-600 font-bold text-lg">{low}</p>
            <p>Low Risks</p>
        </div>
        </div>
    </div>
    );
}


