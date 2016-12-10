
export let judgeUserRole = {
	// const identityText = ['','管理员','校级管理员','教师','学生','访客']
	isAllowRead(role_id){
		if(role_id == 5) return false;
		return true;
	},
	isAllowCommitPost(role_id){
		if(role_id == 5) return false;
		return true;
	},
	isAllowCommitCourseOrTest(role_id){
		if(role_id >= 4) return false;
		return true;
	},
	// isAllowCommitText(role_id){
	// 	if(role_id == 5) return false;
	// 	return true;
	// },
	// isAllowCommitTest(role_id){
	// 	if(role_id >= 4) return false;
	// 	return true;
	// },
	isAllowDeleteComment(role_id, user_id, authod_id){
		if(role_id >= 2 || user_id == authod_id ) return true;
		return false;
	},
	isAllowControlBackStage(role_id){
		if(role_id >= 3) return false;
		return true;
	},
}