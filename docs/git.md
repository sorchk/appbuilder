查看远程分支可以 fetch 或 push
git remote -v

指明我们需要同步的仓库 （fork的仓库）
git remote add upstream

查看
git remote -v

拉取更新的 branches 和 commits
git fetch upstream

Checkout 本地分支
git checkout master

合并
git merge upstream/master

提交
git push origin master
