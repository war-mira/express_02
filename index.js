const express = require('express');
const app = express();
const articles = [{title: 'Example'}];
const bodyParser = require('body-parser');
const Article = require ('./db').Article;
const read = require('node-readability');
const url = 'http://manning.com/cantelon2/';

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
	'/css/bootstrap.css',
	express.static('node_modules/bootstrap/dist/css/bootstrap.css')
);


app.get('/articles', (req, res, next) => {
	Article.all((err, articles) => {
		if(err) return next(err);
		res.send(articles);
	});
});

app.post('/articles', (req, res, next) =>{
	const url = req.body.url;
	read (url, (err, result)=>{
		if(err || !result) res.status(500).send('Error downloading article');
		Article.create(
			{title: result.title, content: result.content},
			(err, article) => {
				if(err) return next(err);
				res.send('Ok');
			}
		);
	});
});

app.get('/articles/:id', (req, res, next) =>{
	const id = req.params.id;
	Article.find(id, (err, article) => {
		if(err) return next(err);
		console.log('Fetching: ', id);
		res.send(articles[id]);
	});
});

app.delete('/articles/:id', (req, res, next) =>{
	const id = req.params.id;
	Article.delete(id, (err) => {
		if(err) return next(err);
		res.send({message: 'Deleted'});
	});
	
});

app.listen(app.get('port'), () => {
	console.log('App started on port', app.get('port'));
});

module.exports.app;