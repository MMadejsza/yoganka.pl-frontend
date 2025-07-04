import { Link } from 'react-router-dom';
import Tile from './Tile.jsx';

function Offer({ id, specifier, header, data, today, limit, moreLink }) {
  let classy = 'offer-type';
  const modifier = specifier ? `offer-type--${specifier}` : '';
  const products = limit ? data.slice(0, limit) : data;
  // const nonClickableTypes = ['class', 'b2b'];
  const nonClickableTypes = ['b2b', 'class'];
  return (
    <article id={id} className={`${classy} ${modifier}`}>
      <header className={`${classy}__header`}>{header}</header>
      {products.map((tileData, index) => (
        <Tile
          data={tileData}
          key={index}
          today={today}
          clickable={nonClickableTypes.includes(tileData.type) ? false : true}
        />
      ))}
      {moreLink ? (
        <Link
          className={`${classy}__more clickable`}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          to={moreLink}
        >
          Zobacz więcej ...
        </Link>
      ) : null}
    </article>
  );
}

export default Offer;
