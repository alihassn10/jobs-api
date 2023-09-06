const { Router } = require("express");
const { createJob, getAllJobs, getJob, deleteJob, updateJob } = require("../controllers/jobs");

const router=Router()

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports=router
