import React from 'react'
import styles from './FiveStar.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const StarFull = () => (
<span className={cx("starContainer_starContainer_sizeSmall")}>
  <span className={cx("star")}>
    <svg viewBox="0 0 1000 1000" style={{fill:'#FFB400',height:'12px',width:'12px',display:'block'}}>
      <path d="M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z"></path>
    </svg>
  </span>
</span>
)
const StarHalf = () => (
<span className={cx("starContainer_starContainer_sizeSmall")}>
  <span className={cx("star")}>
    <svg viewBox="0 0 1000 1000" style={{fill:'#D8D8D8',height:'12px',width:'12px',display:'block'}}>
      <path d="M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z"></path>
    </svg>
  </span>
  <span className={cx("star")}>
    <svg viewBox="0 0 1000 1000" style={{fill:'#FFB400',height:'12px',width:'12px',display:'block'}}>
      <path d="M510.2 23.3l1 767.3-226.1 172.2c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L58 447.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7.1-23.1 28.1-39.1 52.1-39.1z"></path>
    </svg>
  </span>
</span>
)
const StarEmpty = () => (
<span className={cx("starContainer_starContainer_sizeSmall")}>
  <span className={cx("star")}>
    <svg viewBox="0 0 1000 1000" style={{fill:'#D8D8D8',height:'12px',width:'12px',display:'block'}}>
      <path d="M971.5 379.5c9 28 2 50-20 67L725.4 618.6l87 280.1c11 39-18 75-54 75-12 0-23-4-33-12l-226.1-172-226.1 172.1c-25 17-59 12-78-12-12-16-15-33-8-51l86-278.1L46.1 446.5c-21-17-28-39-19-67 8-24 29-40 52-40h280.1l87-278.1c7-23 28-39 52-39 25 0 47 17 54 41l87 276.1h280.1c23.2 0 44.2 16 52.2 40z"></path>
    </svg>
  </span>
</span>
)
const FiveStar = (props) => {
    var star = parseFloat(props.star);
    var full = parseInt(star);
    var half = (star - full) == 0 ? 0 : 1;
    var empty = 5 - full - half;
    var flags = [];
    for (var i = 0; i < 5; i++) flags[i] = 0;
    for (var i = 0; i < full; i++) flags[i] = 2;
    for (var i = 0; i < half; i++) flags[full+i] = 1;
    var objs = flags.map ( (item, index) => {
        if (item == 2) return (<StarFull key={index}/>);
        else if (item == 1) return (<StarHalf key={index}/>);
        else return (<StarEmpty key={index}/>);
    });

    return (
        <span> {objs} </span>
    )
}

FiveStar.propTypes = {
  star: React.PropTypes.number
}

export default FiveStar
