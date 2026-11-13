import React, {useState, useEffect} from 'react'

const SimpleTextRotation = () => {
  const [currentText, setCurrentText] = useState(0)
  const texts = ['Text 1', 'Text 2', 'Text 3']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prevText) => (prevText + 1) % texts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [texts.length])

  return (
    <div className="simple-text-rotation">
        <h1>Simple Text Rotation</h1>
        <p>{texts[currentText]}</p>
    </div>
  )
}



export default SimpleTextRotation