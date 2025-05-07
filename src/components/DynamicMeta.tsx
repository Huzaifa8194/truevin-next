'use client';

import Head from 'next/head';

interface Vehicle {
  stock_number: string;
  allpagedata_fields?: Record<string, any>;
}

interface DynamicMetaProps {
  vehicle: Vehicle;
}

export function DynamicMeta({ vehicle }: DynamicMetaProps) {
  const title = vehicle.allpagedata_fields?.VehicleTitle || vehicle.stock_number;
  const description = `View details for ${title} - Stock #${vehicle.stock_number}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
} 