require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const usermodel = require('./models/users');


const app = express();

app.use(cors());
app.use(bodyParser.json());

//connect database


mongoose.connect(process.env.mongodburl, {useNewUrlParser: true, useUnifiedTopology: true } )

.then(() => console.log('db Connected Successfully'))

.catch((err) => { console.error(err); })


// 1.save or create data

app.post('/',async  (req, res)  => {
    console.log(req.body, 'postdata');

    const chkdataexit = await usermodel.findOne({$or: [{email:req.body.email}, {mobile:req.body.mobile}]});
    if (chkdataexit)
     {
        if(chkdataexit.email === req.body.email)

        {
            res.send({
                msg: "email id already exists"
            });
        }
        else 
        {
            res.send({
                msg: "mobile id already exists"
            });
        }
    }
    else
    {
        //save db
    const data = new usermodel(
        {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        }
    );
    data.save()
    .then(() => {
        console.log('data created successfully')
        data: data
    })
    .catch((err) => { console.error(err); })
      
    }


});




//2 read all data


app.get('/', async (req, res) => {
    console.log('get data');


    const data = await usermodel.find();

    if (data)
    {
        res.send({
            msg: "all user data",
            result: data 
        });
    }else
    {
        res.send({
            msg: "no data"
        })
    }
});

//3. get data by id

app.get('/:id', async(req, res) => {
    console.log(req.params.id, 'ids');
    if(req.params.id)
    {
        const chkid = mongoose.isValidObjectId(req.params.id);
        console.log(chkid, 'chkid');
        if(chkid===true)
        {
            const iddata = await usermodel.findById({_id:req.params.id});
        if(iddata)
        {
            res.send({
                msg: 'single data',
                result: iddata
            });
        }
        else
        {
            res.send({
                msg: "single data not found"
            });
        }
     }
     else
     {
        res.send({
            msg: "invalid user id"
        });
     }

        
    }
   
    
});

//4. delete single data

app.delete('/:id', async(req, res) => {

    console.log('remove data',req.params.id);

    const chkvalidid = mongoose.isValidObjectId(req.params.id);
    if (chkvalidid==true)
    {
        const iddata = await usermodel.deleteOne({_id:req.params.id});
        if(iddata==null)
        {
            res.send({
                msg: "data not found"
            });
        }
        else
        {
            res.send({
                msg: "data remove"
            });
        }
    }else
    {
        res.send({
            msg: "invalid id please enter valid id"
        });
    }
   






});


//5. update single data

app.put('/:id', async (req, res) =>{

    const updatedata = await usermodel.updateOne({_id: req.params.id},{$set:{email: req.body.email}});
    if(updatedata)
    {
        res.send({
            msg: "data updated"
        });
    }
});


//run server
const PORT = process.env.PORT | 8000;
app.listen(PORT, () => {
    console.log(`server running...${PORT}`);
});
