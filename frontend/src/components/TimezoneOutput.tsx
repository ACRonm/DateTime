interface TimezoneOutputProps {
  convertedTime: string;
}

const TimezoneOutput = ({ convertedTime }: TimezoneOutputProps) => {
  return (
    <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-muted/50">
      <p className="text-sm font-medium text-muted-foreground">Converted Time:</p>
      <p className="mt-1 text-xl font-mono">{convertedTime}</p>
    </div>
  );
};

export default TimezoneOutput;
