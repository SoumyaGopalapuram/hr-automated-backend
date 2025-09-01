import ResumeCard from './ResumeCard';

type MatchListProps = {
  matches: any[];
};

export default function MatchList({ matches }: MatchListProps) {
  if (!matches.length) return <p>No matches found</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  );
}
