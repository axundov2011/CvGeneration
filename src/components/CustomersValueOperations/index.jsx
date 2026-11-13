import { useState } from 'react'
import './counter.css'

const CustomersValueOperations = () => {
  const [count, setCount] = useState(0)
  const [customValue, setCustomValue] = useState('')

  const handleCustomOperation = (operation) => {
    const value = Number(customValue)

    if (customValue !== '' && Number.isFinite(value) && value >= 0) {
      setCount((currentCount) => (
        operation === 'add'
          ? currentCount + value
          : Math.max(0, currentCount - value)
      ))
    }

    setCustomValue('')
  }

  const handleReset = () => {
    setCount(0)
    setCustomValue('')
  }

  return (
    <main className="counter-page">
      <section className="counter-card" aria-label="Counter">
        <h1 className="counter-title">Counter</h1>

        <div className="counter-display" aria-live="polite" aria-atomic="true">
          <button
            className="counter-step counter-step--minus"
            type="button"
            onClick={() => setCount((currentCount) => Math.max(0, currentCount - 1))}
            aria-label="Decrease count by one"
          >
            −
          </button>
          <output className="counter-value">{count}</output>
          <button
            className="counter-step counter-step--plus"
            type="button"
            onClick={() => setCount((currentCount) => currentCount + 1)}
            aria-label="Increase count by one"
          >
            +
          </button>
        </div>

        <label className="counter-input-label" htmlFor="custom-value">
          Custom value
        </label>
        <input
          className="counter-input"
          id="custom-value"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="Enter a value"
          value={customValue}
          onChange={(event) => setCustomValue(event.target.value)}
        />

        <div className="counter-actions">
          <button
            className="counter-action counter-action--add"
            type="button"
            onClick={() => handleCustomOperation('add')}
          >
            Addition
          </button>
          <button
            className="counter-action counter-action--subtract"
            type="button"
            onClick={() => handleCustomOperation('subtract')}
          >
            Subtract
          </button>
        </div>

        <button className="counter-reset" type="button" onClick={handleReset}>
          Reset
        </button>
      </section>
    </main>
  )
}

export default CustomersValueOperations
