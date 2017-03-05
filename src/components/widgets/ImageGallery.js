import React from 'react'
import FiveStar from './FiveStar'
//import classes from './Widgets.scss'
//import classNames from 'classnames';
import styles from './Widgets.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);


const ResponsiveImage = (props) => (
    <a className={ cx('media-photo', 'media-cover') } href={ props.href }>
      <div className={ cx('listing-img-container','media-cover','text-center') }>
        <img src={ props.src } className={ cx('responsive-imgwh') } alt={props.alt}/>
      </div>
    </a>
)

const SlideControls = (props) => (
        <div>
          <button className={cx("target-control", "target-prev")} onClick={props.prevItem} >
            <i className={"glyphicon glyphicon-chevron-left "+cx("icon-size-2", "icon-white")} />
          </button>
          <button className={cx("target-control", "target-next")} onClick={props.nextItem} >
            <i className={"glyphicon glyphicon-chevron-right "+cx("icon-size-2", "icon-white")} />
          </button>
        </div>
)

/*
ResponsiveImage.propTypes = {
  src: React.PropTypes.string.isRequired
}
*/
const ImageGallery = (props) => (
        <div className={ cx('imageContainer') }>
          <ResponsiveImage src={props.imgUrl} alt={props.imgDesc} href={props.link}/>
          <SlideControls prevItem={props.prevItem} nextItem={props.nextItem}/>
        </div>
)

export const PriceContainer = (props) => (
    <span>
        <span className={cx('text_size_regular_weight_bold_inline')}>
            <span>{ props.priceUnit || '￥' }</span>
            <span>{ props.price || '---' }</span>
        </span>
        <span className={cx('text_size_small_weight_light_inline')}>
            <span> </span>
            <span>/</span>
            <span>{ props.timeUnit || '晚' }</span>
        </span>
    </span>
)

const DetailContainer = (props) => (
    <div>
        <span className={cx('text_size_small_weight_light_inline')}>
            <span className={cx('detailContainer')}>{ props.desc1 || '独立房间' }</span>
        </span>
        <span className={cx('text_size_small_weight_light_inline')}>
            <span> · </span>
            <span className={cx('detailContainer')}>{ props.desc2 || '1张床' }</span>
        </span>
        <span className={cx('text_size_small_weight_light_inline')}>
            <span> · </span>
            <span className={cx('detailContainer')}>{ props.desc3 || '2个房客' }</span>
        </span>
    </div>
)

const StatusContainer = (props) => (
    <div>
        <span>
            <FiveStar star={props.star} />
            <span>{props.rating}</span>
        </span>
    </div>
)

const InfoContainer = (props) => (
    <div className={cx('infoContainer')}>
        <a className={cx('linkContainer')}>
            <PriceContainer />
            <DetailContainer />
            <StatusContainer star={3.2} rating={36}/>
        </a>
    </div>
)

/* {
   imgUrl, imgDesc
   nextItem, prevItem
} */
ImageGallery.propTypes = {
  imgUrl: React.PropTypes.string,
  imgDesc: React.PropTypes.string,
  link: React.PropTypes.string,
  prevItem: React.PropTypes.func,
  nextItem: React.PropTypes.func
}

const ListingCard = (props) => (
    <div>
        <ImageGallery imgUrl={props.imgUrl} imgDesc={props.imgDesc} link={props.link} />
        <InfoContainer />
    </div>
)

ListingCard.propTypes = {
  price: React.PropTypes.number,
  imgUrl: React.PropTypes.string,
  imgDesc: React.PropTypes.string,
  link: React.PropTypes.string,
  prevItem: React.PropTypes.func,
  nextItem: React.PropTypes.func
}

//export default ImageGallery
export default ListingCard
