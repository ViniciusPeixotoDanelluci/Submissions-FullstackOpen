const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
  <div>
    {
      props.parts.map((p) => <Part {...p} key={p.id} />)
    }
  </div>
)

const Part = (part) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0) /*0 is the initial value*/
  return <p><strong>Total of {total} exercises</strong></p>
}

const Course = ({ courses }) => {
  return (
    <>
      {courses.map(course => (
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      ))}
    </>
  )
}
export default Course