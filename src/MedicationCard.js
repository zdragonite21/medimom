function MedicationCard({ med, type, description, time }) {
  return (
    <div className="medication-card">
      <h1 class="font-bold">{med}</h1>
      <p>{type}</p>
      <p>{description}</p>
    </div>
  );
}

export default MedicationCard;
