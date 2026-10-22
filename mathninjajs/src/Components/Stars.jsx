export default function Stars({ count = 0, criteria = [] }) {
	return (
		<ul className="result-stars" aria-label={`${count} out of 3 stars`}>
			{criteria.map((criterion, index) => {
				const earned = index < count;
				return (
					<li className="result-star-row" key={criterion.label}>
						<span className={`result-star ${earned ? 'earned' : ''}`} aria-hidden="true">
							{earned ? '★' : '☆'}
						</span>
						<span className="result-star-description">{criterion.label}</span>
						<strong className="result-star-value">{criterion.value}</strong>
					</li>
				);
			})}
		</ul>
	);
}
