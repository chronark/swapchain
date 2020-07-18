import React from "react"
import classnames from "classnames"
import Layout from "@theme/Layout"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import useBaseUrl from "@docusaurus/useBaseUrl"
import styles from "./styles.module.css"

const features = [
  {
    title: <>You own your private keys</>,
    imageUrl: "img/key.svg",
    description: (
      <>
        If you don't own the private keys, you don't own the coins. With swapchain your private keys belong to you. Your
        private keys will never leave your browser or CLI, giving you full control over them.
      </>
    ),
  },
  {
    title: <>Zero trust required</>,
    imageUrl: "img/lock-closed.svg",
    description: (
      <>
        Since Swapchain uses Hash TimeLock Contracts (HTLCs), there are no more counterparty risks. This means you don't
        have to trust your exchange partner and can trade safely.
      </>
    ),
  },
  {
    title: <>Trade crypto assets the way you like</>,
    imageUrl: "img/collection.svg",
    description: (
      <>
        With Swapchain, you can choose your preferred rate and priority, making your cryptocurrency transactions both
        more flexible to your needs and safer.
      </>
    ),
  },
]

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout title={`swapchain documentation`} description="Description will go into a meta tag in <head />">
      <header className={classnames("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames("button button--outline button--secondary button--lg", styles.getStarted)}
              to={useBaseUrl("docs/product-documentation")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default Home
