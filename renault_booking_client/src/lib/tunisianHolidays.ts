export const getTunisianHolidays = (year: number) => {
    const fixedHolidays = [
      { name: "Jour de l’An", date: `${year}-01-01` },
      { name: "Fête de l'Indépendance", date: `${year}-03-20` },
      { name: "Journée des Martyrs", date: `${year}-04-09` },
      { name: "Fête du Travail", date: `${year}-05-01` },
      { name: "Fête de la République", date: `${year}-07-25` },
      { name: "Journée de la Femme", date: `${year}-08-13` },
      { name: "Journée de l’Évacuation", date: `${year}-10-15` },
      { name: "Journée de la Révolution", date: `${year}-12-17` }
    ];
  
    const islamicHolidays = [
      { name: "Aïd el-Fitr", date: `${year}-04-10` }, 
      { name: "Aïd el-Adha", date: `${year}-06-16` },
      { name: "Nouvel An hégirien", date: `${year}-07-07` },
      { name: "Mouloud (Naissance du Prophète)", date: `${year}-09-27` }
    ];
  
    const schoolVacations = [
      { name: "Vacances d’hiver", start: `${year}-12-17`, end: `${year + 1}-01-02` },
      { name: "Vacances de printemps", start: `${year}-02-26`, end: `${year}-03-06` },
      { name: "Vacances d’été", start: `${year}-06-05`, end: `${year}-09-15` }
    ];
  
    return {
      fixedHolidays,
      islamicHolidays,
      schoolVacations
    };
  };
  