import _debug from 'debug'
const debug = _debug('app:hoe')
import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './TouchtopLayout.scss';
import classNames from 'classnames';
import Measure from 'react-measure'
import _ from 'lodash';


export class TouchtopLayout extends Component {
    constructor (props) {
        super (props);
        this.state = {
            activeArray:[],
            currentSlide: 0,
            nextSlide: 0,
            enableSlide: true,
        };
        this.anchors = {};
        this.slideCount = 3;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.intervalId = setInterval( () => {
            if (this.state.enableSlide)
                this.startAnimation();
        }, 5000 );
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        if (this.intervalId) {
            clearInterval (this.intervalId);
            this.intervalId = null;
        }
    }

    handleScroll (event) {
        var windowScrollTop = window.scrollTop;
        var windowHeight = window.height;
        var activeArray = [];
        var viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        _.forOwn (this.anchors, (ele, key) => {
            var eleRect = ele && ele.getBoundingClientRect();
            //console.log (key, eleRect);
            if (eleRect) {
                if (!(eleRect.bottom < 80 || eleRect.top > viewportH)) {
                    activeArray.push (key);
                }
            }
        });
        //activeArray = _.sortedUniq (activeArray);
        var diff = _.xor (activeArray, this.state.activeArray);
        if (diff.length > 0) {
            this.setState ({activeArray});
            //console.log (activeArray);
            //console.log (document.documentElement.clientHeight, window.innerHeight, viewportH);
        }
        // var bodyRect = document.body.getBoundingClientRect();
        // var viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        // var viewPortH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        // var eleRect = this.xxx && this.xxx.getBoundingClientRect();
        // console.log ("window body=",bodyRect, ", ele=", eleRect);
        // console.log ("diff=", (bodyRect.top - (eleRect && eleRect.top || 0)));
    }
    scrollTo (eleName) {
        var ele = this.anchors && this.anchors[eleName];
        if (ele) {
            var bodyRect = document.body.getBoundingClientRect();
            var eleRect = ele.getBoundingClientRect();
            //console.log (eleName+" offsetTop="+ele.offsetTop+", offsetLeft="+ele.offsetLeft+", rect=",ele.getBoundingClientRect());
            //console.log ("window body=",bodyRect, ", ele=", eleRect);
            //console.log ("diff=", (bodyRect.top - eleRect.top))
            var scrollVertial = ele.offsetTop - 75;
            if (scrollVertial < 0) scrollVertial = 0;
            window.scrollTo( 0,  scrollVertial);
            this.xxx = ele;
        }
    }

    startAnimation () {
        var nextSlide = Math.round((this.state.currentSlide + 1) % this.slideCount)
        this.setState({nextSlide});
        setTimeout(()=>{
            this.stopAnimation();
        }, 1000);
    }
    stopAnimation () {
        console.log ("stopAnimation:", new Date().getTime()/1000);
        if (this.state.nextSlide != this.state.currentSlide)
            this.setState ({currentSlide: this.state.nextSlide});
    }
    enableAnimation (enable) {
        console.log ("animation:", enable);
        this.setState ({enableSlide: enable});
    }
    render () {
        const eleClass = (name) => {
            if(_.indexOf(this.state.activeArray, name)>=0) 
                return 'active';
            else
                return null;
        } 

        var currentJob = this.state.jobTab || 1;
        const jobStyle = (id) => {
            if (currentJob == id)
                return {display: 'block'};
            else
                return {display: 'none'};
        }

        console.log ("state:", this.state);
        var current = this.state.currentSlide;
        var next = this.state.nextSlide;
        const slideClass = (id) => {
            var slideStyle = ['item'];
            if (current == next) {
                // slide animation finish.
                if (id == current)
                    slideStyle.push('active');
            } else {
                if (current == id) {
                    slideStyle.push('active');
                    slideStyle.push('left');
                }
                if (next == id) {
                    slideStyle.push('next');
                    slideStyle.push('left');
                }
            }
            return classNames(slideStyle);
        }

        const slideIndicatorClass = (id) => {
            if (next == id) {
                return 'active';
            } else {
                return null;
            }
        }

        const setCarousel = (ele) => {
            this.carousel = ele;
        }
        const setCarousel1 = (ele) => {
            console.log ("setCarousel ", ele, new Date().getTime()/1000);
            if (this.carousel) {
                this.carousel.removeEventListener("transitionend", this.stopAnimation.bind(this));
            }
            this.carousel = ele;
            if (this.carousel) {
                this.carousel.addEventListener("transitionend", this.stopAnimation.bind(this));
            }
        }

        return (
<div>
{/*<!-- 固定层 -->*/}
	<div id="online_layer" className={classes.onlineLayer} show="1"
		style={{fontSize: 10, textAlign: 'center', right: 0, display: 'block'}}>

		<ul className="list-group">
			<li className="list-group-item"
				style={{padding: 5, backgroundColor: '#00a7ea'}}><a title="免费咨询热线"
				href="index.html#contact" style={{color: '#fff'}}><i
					className="fa fa-phone fa-2x"></i><b>400 157 9288</b></a></li>
			<li className="list-group-item" style={{padding: 5}}><img
				alt="触鼎健康" title="触鼎健康" width="100px" height="100px"
				src="assets/img/qrcode_for_touchtop.jpg"/>
			<div>触鼎健康</div></li>
			<li className="list-group-item" style={{padding: 5}}><img
				alt="触鼎健康管家" title="触鼎健康管家" width="100px" height="100px"
				src="assets/img/qrcode_for_manager.jpg"/>
			<div>触鼎健康管家</div></li>
			<li className="list-group-item" style={{padding: 5}}><a
				href="javascript:void(0);" style={{color: '#888'}}
				onclick="$('#online_layer').remove();">关闭</a></li>
		</ul>
	</div>
	
	<div id="navbar-main">
		{/*<!-- Fixed navbar -->*/}
		<div className={classNames("navbar navbar-default navbar-fixed-top", classes.navChange)}>
			<div className="container">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle" data-toggle="collapse"
						data-target=".navbar-collapse">
						<span className="icon-bar"></span> <span className="icon-bar"></span> <span
							className="icon-bar"></span>
					</button>
					<a className={classNames("navbar-brand", classes.logo)} title="北京触鼎科技有限公司" href="index.html#home"><img src='assets/img/logo.png'/></a>
				</div>
				<div className="navbar-collapse collapse">
					<ul className="nav navbar-nav navbar-right">
						<li className={eleClass('home')}><a href="javascript:void(0)" className="smoothScroll" onClick={()=>this.scrollTo("home")}>主页</a></li>
						<li className={eleClass('about')}><a href="javascript:void(0)" className="smoothScroll" onClick={()=>this.scrollTo("about")}> 公司介绍</a></li>
						<li className={eleClass('services')}><a href="javascript:void(0)" className="smoothScroll" onClick={()=>this.scrollTo("services")}> 方案介绍</a></li>
						<li className={eleClass('portfolio')}><a href="javascript:void(0)" className="smoothScroll" onClick={()=>this.scrollTo("portfolio")}> 产品展示</a></li>
						<li className={eleClass('news')}><a href="javascript:void(0)" className="smoothScroll" onClick={()=>this.scrollTo("news")}> 新闻中心</a></li>
						<li className={eleClass('contact')}><a href="javascript:void(0)" className="smoothScroll" onClick={()=>this.scrollTo("contact")}> 关于我们</a></li>
						<li><a href="http://mcu.touchtop.com.cn" target="mcuhealth" className="smoothScroll"> 远程健康</a></li>
					</ul>
				</div>
				{/*<!--/.nav-collapse -->*/}
			</div>
		</div>
	</div>

	{/*<!-- ==== HEADERWRAP ==== -->*/}
	<div id="home" name="home" ref={ (ele) => { this.anchors.home = ele; } }>
		<div className="container" style={{width: '100%', padding: 0}}>
			{/*<!--   <header className="clearfix">
    <h1>Design, Development, Marketing.</h1>
    <p>Lorem ipsum dolor sit amet, cu menandri molestiae voluptaria eam,<br/>
      invidunt reprehendunt nec ei. Sonet regione consulatu vel id.</p>
    <a href="#portfolio" className="smoothScroll btn btn-lg">See Our Works</a> </header> -->*/}
			<div style={{height: 75}}></div>
			<div id="myCarousel" ref={(ele) => setCarousel(ele)} className="carousel slide" data-ride="carousel" onMouseOver={()=>this.enableAnimation(false)} onMouseOut={()=>this.enableAnimation(true)}>
				{/*<!-- Indicators -->*/}
				<ol className="carousel-indicators">
					<li data-target="#myCarousel" data-slide-to="0" className={slideIndicatorClass(0)}></li>
					<li data-target="#myCarousel" data-slide-to="1" className={slideIndicatorClass(1)}></li>
					<li data-target="#myCarousel" data-slide-to="2" className={slideIndicatorClass(2)}></li>
				</ol>

				{/*<!-- Wrapper for slides -->*/}
				<div className="carousel-inner" role="listbox">
					<div className={slideClass(0)}>
						<div className="item-img" style={{background: '#00A7EB'}}>
							<a href="index.html#"> <img className="img-responsive center-block"
								src="assets/img/banner3.jpg" alt="很抱歉，图片找不到了"/>
							</a>
						</div>
						<div className="carousel-caption"></div>
					</div>
					<div className={slideClass(1)}>
						<div className="item-img" style={{background: '#8CD5F5'}}>
							<a href="index.html#"> <img className="img-responsive center-block"
								src="assets/img/banner1.jpg" alt="很抱歉，图片找不到了"/>
							</a>
						</div>
						<div className="carousel-caption"></div>
					</div>
					<div className={slideClass(2)}>
						<div className="item-img" style={{background: '#00A7EB'}}>
							<a href="index.html#"> <img className="img-responsive center-block"
								src="assets/img/banner2.jpg" alt="很抱歉，图片找不到了"/>
							</a>
						</div>
						<div className="carousel-caption"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	{/*<!-- /headerwrap -->*/}

	{/*<!-- ==== ABOUT ==== -->*/}
	<div id="about" name="about" ref={ (ele) => { this.anchors.about = ele; } }>
		<div className="container">
			<div className="row white">
				<div className="col-md-6 img-company">
					<img className="img-responsive" src="assets/img/about/company.png"/>
				</div>
				<div className="col-md-6">
					<h2>公司介绍</h2>
					<p style={{textIndent: '2em', textAlign: 'left'}}>北京触鼎科技有限公司（注册商标：TouchTop）是一家致力于智能医疗健康产品与健康大数据采集、处理、分析、应用的创新型科技企业，为机构客户专属定制智能健康终端，给用户提供各种生理参数、生化指标的测量以及中医体检、健康风险评估，为用户建立有效的个人健康档案，对慢性病患者、亚健康人群、连锁药店会员进行有效的健康跟踪，增加会员黏性，提升服务品质。自主开发的分钟体检增值业务系统为连锁经营企业精准营销、客户管理提供大数据支持。</p>
				</div>
			</div>
			{/*<!-- row -->*/}
		</div>
	</div>
	{/*<!-- container -->*/}

	{/*<!-- ==== SERVICES ==== -->*/}
	<div id="services" name="services" className={classes.services} ref={ (ele) => { this.anchors.services = ele; } }>
		<div className="container">
			<div className="row">
				<h2 className="text-center">方案介绍</h2>
				<hr/>
				<div className="col-xs-12 col-sm-6 callout">
					<h3>『&nbsp;智慧社区&nbsp;』</h3>
					<div><img className="img-responsive center-block"
								src="assets/img/community.png" alt="很抱歉，图片找不到了"/></div>
				</div>
				<div className="col-xs-12 col-sm-6 callout">
					<h3>『&nbsp;智慧养老&nbsp;』</h3>
					<div><img className="img-responsive center-block"
								src="assets/img/pension.png" alt="很抱歉，图片找不到了"/></div>
				</div>
				<div className="col-xs-12 col-sm-6 callout">
					<h3>『&nbsp;快速建档&nbsp;』</h3>
					<div><img className="img-responsive center-block"
								src="assets/img/package.jpg" alt="很抱歉，图片找不到了"/></div>
				</div>
				<div className="col-xs-12 col-sm-6 callout">
					<h3>『&nbsp;上门体检&nbsp;』</h3>
					<div><img className="img-responsive center-block"
								src="assets/img/medical.png" alt="很抱歉，图片找不到了"/></div>
				</div>

			</div>
			{/*<!-- row -->*/}
		</div>
	</div>
	{/*<!-- container -->*/}

	{/*<!-- ==== PORTFOLIO ==== -->*/}
	<div id="portfolio" name="portfolio" ref={ (ele) => { this.anchors.portfolio = ele; } }>
		<div className="container text-center">
			<div className="row">
				<h2 className="text-center">产品展示</h2>
				<hr/>			
			</div>
			{/*<!-- /row -->*/}
			<div className="container">
				<div className="row">

					{/*<!-- PORTFOLIO IMAGE 1 -->*/}
					<div className="col-md-4 ">
						<div className="grid mask">
							<img className="img-responsive"
									src="assets/img/portfolio/follow-package.jpg" alt=""/>
							移动随诊包
						</div>
						{/*<!-- /grid-mask -->*/}
					</div>

					{/*<!-- PORTFOLIO IMAGE 2 -->*/}
					<div className="col-md-4">
						<div className="grid mask">
							<img className="img-responsive"
									src="assets/img/portfolio/T1-A.jpg" alt=""/>
							经济型分钟体检一体机T1
						</div>
						{/*<!-- /grid-mask -->*/}
					</div>

					{/*<!-- PORTFOLIO IMAGE 3 -->*/}
					<div className="col-md-4">
						<div className="grid mask">
							<img className="img-responsive"
									src="assets/img/portfolio/T1-B.jpg" alt=""/>
							豪华型分钟体检一体机T2
						</div>
						{/*<!-- /grid-mask -->*/}
					</div>
				</div>
				{/*<!-- /row -->*/}

				{/*<!-- PORTFOLIO IMAGE 4 -->*/}
				<div className="row">
					<div className="col-md-4 ">
						<div className="grid mask">
							{/*<!-- <div className="uray-div-bg-header"></div> -->*/}
							<img className="img-responsive"
									src="assets/img/portfolio/iwatch.jpg" alt=""/>
							{/*<!-- <div className="uray-div-bg-footer"></div> -->*/}
							无感脉搏定位SOS智能手表
						</div>
						{/*<!-- /grid-mask -->*/}
					</div>

					{/*<!-- PORTFOLIO IMAGE 5 -->*/}
					<div className="col-md-4">
						<div className="grid mask">
							<div className="uray-div-bg-header"></div>
							<img className="img-responsive"
									src="assets/img/portfolio/x60.jpg" alt=""/>
							<div className="uray-div-bg-footer"></div>
							智能体检一体机E100
						</div>
						{/*<!-- /grid-mask -->*/}
					</div>
					{/*<!-- PORTFOLIO IMAGE 5 -->*/}
					<div className="col-md-4">
						<div className="grid mask">
							<img className="img-responsive"
									src="assets/img/portfolio/x60.jpg" alt=""/>
							智能体检一体机X60
						</div>
						{/*<!-- /grid-mask -->*/}
					</div>
					{/*<!-- /col -->*/}
				</div>
				{/*<!-- /row -->*/}				
				<div className="row">			
					<div className="col-lg-8 col-lg-offset-2 text-center">
						<p className="large">
						欢迎移动医疗设备供应商与我们联系，我们将提供专业的数据集成和云健康平台对接服务，并提供专业的产品优化建议。<br/>联系电话：18920021812 陈先生，联系邮箱：contract@touchtop.com.cn</p>
					</div>				
				</div>
			</div>
			{/*<!-- /row -->*/}
		</div>
	</div>
	{/*<!-- /container -->*/}

	{/*<!-- ==== NEWS ==== -->*/}
	<div id="news" name="news" ref={ (ele) => { this.anchors.news = ele; } }>
		<div className="container">
			<div className="row">
				<h2 className="text-center">新闻中心</h2>
				<hr/>
				<div>
				<table className="table table-striped">
      <tbody>
      <tr>
          <th scope="row">1</th>
          <td><a href="news/news160830.html" target="news160830">中国初级卫生保健基金会与北京触鼎科技有限公司初步达成基层慢病筛查管理项目合作意向</a></td>
          <td>2016-08-30</td>
        </tr>
      <tr>
          <th scope="row">2</th>
          <td><a href="news/news160618.html" target="news160618">为广州海王星辰周年庆活动提供免费分钟体检活动支持</a></td>
          <td>2016-06-18</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td><a href="news/news160617.html" target="news160617">药房慢性病系统建设和移动医疗的有机结合</a></td>
          <td>2016-06-17</td>
        </tr>
        <tr>
          <th scope="row">4</th>
          <td><a href="news/news160427.html" target="news160427">我公司参加高端分享沙龙现场收获订单</a></td>
          <td>2016-04-27</td>
        </tr>
        <tr>
          <th scope="row">5</th>
          <td><a href="news/news160415.html" target="news160415">触鼎科技创建医疗新模式</a></td>
          <td>2016-04-15</td>
        </tr>
         <tr>
          <th scope="row">6</th>
          <td><a href="news/news160414.html" target="news160414">触鼎科技专注顶层数据整合，打造cHealth</a></td>
          <td>2016-04-14</td>
        </tr>
      </tbody>
    </table>
				</div>
				
			</div>
		</div>
	</div>
	
	{/*<!-- ==== CONTACT ==== -->*/}
	<div id="contact" name="contact" className={classes.contact} ref={ (ele) => { this.anchors.contact = ele; } }>
		<div className="container">
			<div className="row">
				<h2 className="text-center">联系我们</h2>
				<hr/>
				<div className="col-md-4 text-center">
					<a style={{color:'#fff'}} target="_blank"
						href="http://api.map.baidu.com/marker?location=39.881838,116.703722&title=北京触鼎科技有限公司&content=北京市通州区金隅自由筑142号楼一层&output=html"><i
						className="fa fa-map-marker fa-2x"></i>
						<p>北京市通州区金隅自由筑142号楼一层</p></a>
				</div>
				<div className="col-md-4">
					<a style={{color:'#fff'}}
						href="mailto:info@touchtop.com.cn"><i
						className="fa fa-envelope-o fa-2x"></i>
						<p>contract@touchtop.com.cn</p></a>
				</div>
				<div className="col-md-4">
					<i className="fa fa-phone fa-2x"></i>
					<p>400 157 9288<br/>010 - 58041905</p>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-8 col-lg-offset-2 text-center">
					<p>乘车路线：地铁八通线土桥站下车，步行或者乘坐通6经2站在花石匠小区西站下车即可看到金隅自由筑</p>
				</div>
			</div>
			{/*<!-- row -->*/}
		</div>
	</div>
	{/*<!-- container -->*/}

	{/*<!-- ==== JOBS ==== -->*/}
	<div id="job" name="job" ref={ (ele) => { this.anchors.job = ele; } }>
		<div className="container">
			<div className="row text-center job-row">
				<h2 className="text-center">招贤纳士</h2>
				<hr/>
				<div className="con" id="lib_Tab1_sx" className="lib_tabborder_sx">
					<div className="col-sm-3 left lib_Menubox_sx">
						<div className="list-group lg_div">
							<a
								style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
								id="jobType1" onClick={()=>this.setState({jobTab:1})} href="javascript:void(0);"
								className="first-a list-group-item active ">产品经理</a> <a
								id="jobType2" onClick={()=>this.setState({jobTab:2})} href="javascript:void(0);"
								className="other-a list-group-item">技术支持工程师</a> <a id="jobType3"
								onClick={()=>this.setState({jobTab:3})} href="javascript:void(0);"
								className="other-a list-group-item">市场部经理</a> <a id="jobType4"
								onClick={()=>this.setState({jobTab:4})} href="javascript:void(0);"
								className="other-a list-group-item">UI设计师</a> <a id="jobType5"
								onClick={()=>this.setState({jobTab:5})} href="javascript:void(0);"
								className="other-a list-group-item">Android研发工程师</a> <a
								style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}
								id="jobType6" onClick={()=>this.setState({jobTab:6})} href="javascript:void(0);"
								className="last-a list-group-item"> Java研发工程师</a>

						</div>
					</div>
					<div className="col-sm-6 content lib_Contentbox_sx" style={{textAlign: 'left'}}>
						<div id="jobContent1" style={jobStyle(1)}>
							岗位职责：<br/> <span className="span-word">1、负责相关部门产品的需求调研、数据分析、功能设计、交互体验设计等；<br/>
								2、根据公司战略，制定或参与所负责产品的策略和规划；<br/> 3、负责制定APP产品的版本规划，进行产品迭代；<br/>
								4、负责完成产品交互设计工作，指导视觉设计师工作，保证用户体验的最优和跨终端体验的一致性；<br/>
								<p>5、收集用户反馈，分析其行为、关联并及时总结，将各资源迅速转化为可应用的产品。</p></span> 岗位要求：<br/> <span
								className="span-word">1、3年以上工作经验，能独立带领项目团队完成任务；<br/>
								2、熟悉并掌握各移动平台的特性；<br/> 3、能够从用户角度来体验和改进产品，有较强的数据及用户行为分析能力；<br/>
								4、责任心强，喜欢创业团队氛围，出色的语言表达与沟通能力，组织协调能力强，能适应变化，抗压能力强；<br/>
								5、有医疗行业经验优先考虑。
							</span>
						</div>
						<div id="jobContent2" style={jobStyle(2)}>
						岗位职责：<br/> <span className="span-word">
1、参与产品售前、售中及售后技术支持；<br/>
2、及时处理客户的咨询、培训、问题反映；<br/>
3、负责售后技术保障、解决一般性技术问题；<br/>
<p>4、接受并按时完成公司或上级领导分派的各项工作。</p></span>
岗位要求：<br/><span className="span-word">
1、沟通能力佳，有团队意识。<br/>
2、自我管理能力强，有耐心，能够接受短期出差；<br/>
3、具有独立处理问题的能力、强烈的责任感、认真踏实的工作作风；<br/>
4、具有技术支持、医疗健康行业方面工作经验者优先。</span>
						</div>
						<div id="jobContent3" style={jobStyle(3)}>
						岗位职责：<br/> <span className="span-word">
1、负责公司产品市场营销计划，制定营销推广方案；<br/>
2、为公司市场推广、营销业绩负责，定期向管理层汇报；<br/>
3、策划、执行在线推广活动，收集推广反馈数据，不断改进推广效果；<br/>
4、根据品牌定位与用户研究，结合流量和运营数据分析，定位精准的流量渠道；<br/>
<p>5、市场竞争分析, 互联网金融行业产品形态、模式、发展趋势分析，研究竞争对手、同行业产品成功推 广案例对公司发展提出有效建议。</p></span>
岗位要求：<br/><span className="span-word">
1、本科或以上学历，营销、管理、金融类专业毕业优先考虑；<br/>
2、五年以上金融行业或互联网行业工作经验，有3年以上团队管理经验者优先考虑；<br/>
3、具有良好的客户沟通、人际交往及维护客户关系的能力；<br/>
4、具有敏锐的市场洞察力和准确的客户分析能力，能够有效开发客户、推广渠道等资源，获取有效客源；<br/>
5、熟悉互联网或移动互联网运营，有互联网、医疗健康相关行业从业经历者优先。
</span>
						</div>
						<div id="jobContent4" style={jobStyle(4)}>
												岗位职责：<br/> <span className="span-word">
1、负责IOS和Android手机端、Web端页面设计和交互；<br/>
2、负责为H5产品提供整体设计、创意美术设计，并辅助完成公司其他设计；<br/>
3、理解各项产品的设计方案，保证所有产品的视觉整体性；<br/>
4、关注视觉化的版面设计及用户交互元素的设计；<br/>
<p>5、与产品团队合作，改善产品。</p></span>
岗位要求：<br/><span className="span-word">
1、美术、设计或相关专业专科以上学历，1年以上ui设计经验；<br/>
2、具备专业的色彩知识、平面知识、立体构成知识和较强的造型及配色能力；<br/>
3、学习能力强，沟通能力强,具有强烈的团队合作精神；<br/>
4、具有创新意识，对工作能提出各种优化改进建议；<br/>
5、能独立担当设计工作，能适应高强度的工作，并保持乐观精神，善于团队合作；<br/>
6、精通本专业大部分设计软件（Photoshop、Flash、Dreamweaver、Illustrator等），了解设计常用的大部分软件；<br/>
7、手绘能力强或有移动端产品设计经验者优先考虑；<br/>
8、投递简历时需附上相关作品。
</span>
						</div>
						<div id="jobContent5" style={jobStyle(5)}>
																		岗位职责：<br/> <span className="span-word">
1、参与Android客户端软件产品的概要设计、详细设计和编码，确保项目进度和质量达到相关要求；<br/>
2、 协同测试和客户服务等部门解决客户端软件开发和发布过程中出现的各种问题；<br/>
3、持续地优化相关的产品的质量、性能和用户体验；<br/>
<p>4、参与软件技术架构和关键技术的攻关。</p></span>
岗位要求：<br/><span className="span-word">
1、计算机及相关专业大专以上学历，java基础扎实；<br/>
2、熟悉Android系统架构及相关技术，3年以上Android平台开发经验；<br/>
3、精通Android UI设计，熟悉移动终端的特性和开发特点，有Android平台各类常见问题的应对经验；<br/>
4、熟悉多线程、TCP/IP、SOCKET、http等相关编程技术并具备相关的开发经验；<br/>
5、熟悉IPC机制，熟练运用aidl；<br/>
6、熟练编写SQL语句，熟悉SQLite数据库的使用；<br/>
7、有较强的分析和解决问题的能力；<br/>
8、有较好的团队合作精神、良好的沟通能力、较强的学习能力、高度的责任感和较强的抗压能力。
</span>
						</div>
						<div id="jobContent6" style={jobStyle(6)}>
岗位职责：<br/> <span className="span-word">
1、根据不同的业务需求，与产品、运营等沟通协作，提炼产品技术解决方案并形成技术规划；<br/>
2、 参与产品的系统分析、详细设计、编码实现和技术文档等工作，确保业务支撑系统的质量、安全和性能；<br/>
<p>3、较强的沟通能力和团队合作精神，工作灵活积极性高，逻辑思维能力强，具有较好的编码习惯。</p></span>
岗位要求：<br/><span className="span-word">
1、计算机及相关专业大专以上学历，java基础扎实，3年以上j2ee开发经验；<br/>
2、熟悉j2ee框架，有实际基于j2ee的B/S应用系统开发经验；<br/>
3、熟练掌握jsp、java 、JavaScript、Html、XML等开发语言；<br/>
4、熟悉MVC开发架构，如：struts、hibernate、spring等；<br/>
5、熟悉SQL Server、MySql、Oracle至少一种数据库；<br/>
6、了解Tomcat、Weblogic、Websphere应用服务器（其中之一）；<br/>
7、有良好的编程风格，掌握OOP、OOA方法；<br/>
8、有团队合作精神，善于与人沟通。
</span>
						</div>
					</div>
					<div className="col-sm-3 right email-div">
						<div className="right-con">
							投递简历至<br/> <a href="mailto:chenli@touchtop.com.cn">hr@touchtop.com.cn</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="row">
			<div className="col-lg-8 col-lg-offset-2 text-center">&nbsp;</div>
		</div>
		{/*<!-- row -->*/}
	</div>
	{/*<!-- container -->*/}

	<div id="footerwrap" className={classes.footerwrap}>
		<div className="container">
			<div className="row">
				<div className="">
					<span className={classes.copyright}>Copyright &copy; 2013-<script type="text/javascript">
	{/*<!--
	var today=new Date()
	var years=today.getFullYear();
	document.write(years);
	//-->*/}</script> TouchTop
						北京触鼎科技有限公司 <a href="http://www.miitbeian.gov.cn" target="_blank">京ICP备15059892号</a>
						<script type="text/javascript">
							var cnzz_protocol = (("https:" == document.location.protocol) ? " https://"
									: " http://");
							document
									.write(unescape("%3Cspan id='cnzz_stat_icon_1256975779'%3E%3C/span%3E%3Cscript src='"
											+ cnzz_protocol
											+ "s11.cnzz.com/z_stat.php%3Fid%3D1256975779%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));
						</script>
					</span>
				</div>
				{/*<!-- <div className="col-md-4" style="color: #888; padding-bottom: 0px;">
					<ul className="list-inline social-buttons">
						<li style="float: left;"></li>
						<li></li>
					</ul>
				</div> -->*/}
			</div>
		</div>
	</div>
</div>
        );
    }
}

TouchtopLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}


export default TouchtopLayout
