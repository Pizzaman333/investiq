import chartGrowth from '../../assets/icons/decorative/chart-growth.svg'
import financeGraph from '../../assets/icons/decorative/finance-graph.svg'
import handCoin from '../../assets/icons/decorative/hand-coin.svg'
import moneyDocument from '../../assets/icons/decorative/money-document.svg'
import receiptCalculator from '../../assets/icons/decorative/receipt-calculator.svg'
import styles from './BackgroundPattern.module.css'

const decorativeAssets = [
  handCoin,
  chartGrowth,
  receiptCalculator,
  financeGraph,
  moneyDocument,
  handCoin,
  receiptCalculator,
  chartGrowth,
]

export function BackgroundPattern() {
  return (
    <div className={styles.pattern} aria-hidden="true">
      {decorativeAssets.map((icon, index) => (
        <span key={`${icon}-${index}`} className={[styles.symbol, styles[`item${index + 1}`]].join(' ')}>
          <img src={icon} alt="" />
        </span>
      ))}
    </div>
  )
}
