Create Restful api's for our website.
//form validations
<div class="invalid-feedback">create form validations.</div>
//custom express error
app.all("*", (req, res, next)=>{
     next(new ExpressError(404, "Page Not Found!"));
});
