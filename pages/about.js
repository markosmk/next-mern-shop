const About = () => (
  <p>This is about mi App! MarkosMk I am testing the loading time to 1000ms</p>
)

export async function getServerSideProps() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  return { props: {} }
}

export default About
