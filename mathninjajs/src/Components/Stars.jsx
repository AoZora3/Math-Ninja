export default function Stars({ count = 0 }) {
	return (
		<div className="result-stars" role="img" aria-label={`${count} out of 3 stars`}>
			{[0, 1, 2].map((star) => (
				<span className={star < count ? 'result-star earned' : 'result-star'} key={star} aria-hidden="true">
					{star < count ? '★' : '☆'}
				</span>
			))}
		</div>
	);
}

