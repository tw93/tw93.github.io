# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "cosy-jekyll-theme"
  spec.version       = "1.1.1"
  spec.authors       = ["Tw93"]
  spec.email         = ["tangweiyuanyou@gmail.com"]

  spec.summary       = %q{cosy-jekyll-theme is a responsive blog template providing a good reading experience. No jQuery,And More concise,More geeks and Faster than other jekyll theme.}
  spec.homepage      = "https://github.com/tw93/tw93.github.io"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_runtime_dependency "jekyll", ">= 3.3", "< 5.0"

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", ">= 12.3.3"
  spec.post_install_message = "Thanks for installing! You can view the live demo on http://tw93.github.io"

end
