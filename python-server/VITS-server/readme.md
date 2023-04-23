# Python后端（Vits）安装步骤：

- 相关说明：https://github.com/CelestialRipple/VITS-fast-fine-tuning/tree/main/tts_web_api
- 由于前端样式只针对V进行了适配，这里给出我自己训练的模型https://drive.google.com/drive/folders/15A96uS8yqkgciGcsvVdbFUcxI6-YfEY4?usp=share_link

```shell
# clone代码 
git clone https://github.com/CelestialRipple/VITS-fast-fine-tuning

# 安装全部依赖 （如果报错请手动安装）
pip3 install -r requirements.txt  -i https://pypi.tuna.tsinghua.edu.cn/simple

# 编译
cd monotonic_align
python setup.py build_ext --inplace

# 导入模型文件
cd VITS-fast-fine-tuning/tts_web_api/models/
mkdir /YOUR_MODELS_NAME
cd /YOUR_MODELS_NAME
wget “模型链接” # 如果想直接下载V的模型，可输入gdown --id 15A96uS8yqkgciGcsvVdbFUcxI6-YfEY4


# 启动
cd VITS-fast-fine-tuning/tts_web_api/
python main.py
```
