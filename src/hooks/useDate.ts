import * as React from "react";

export const useDateState = ()=> {
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate,setEndDate] = React.useState<Date>();

    return {startDate,setStartDate,endDate,setEndDate};
} 