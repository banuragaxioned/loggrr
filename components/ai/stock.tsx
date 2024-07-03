export async function Stock({ symbol, numOfMonths }: { symbol: string; numOfMonths: number }) {
  // const response = await fetch(`https://api.example.com/stock/${symbol}/${numOfMonths}`);
  // const data = await response.json();

  const data = {
    timeline: [
      { date: "2021-01-01", value: 100 },
      { date: "2021-01-02", value: 101 },
      { date: "2021-01-03", value: 102 },
      { date: "2021-01-04", value: 103 },
    ],
  };

  return (
    <div>
      <div>{symbol}</div>

      <div>
        {data.timeline.map((data: any) => (
          <div>
            <div>{data.date}</div>
            <div>{data.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
