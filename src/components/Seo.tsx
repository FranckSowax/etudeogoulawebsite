type SeoProps = {
  title: string
  description: string
  canonical?: string
  jsonLd?: object | object[]
}

const SITE = 'https://www.notaire-ogoula-gabon.com'

export default function Seo({ title, description, canonical, jsonLd }: SeoProps) {
  const url = canonical ? (canonical.startsWith('http') ? canonical : `${SITE}${canonical}`) : undefined
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ldArray.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  )
}
