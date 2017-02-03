# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "cosy-jekyll-theme"
  spec.version       = "1.0.7"
  spec.authors       = ["Tw93"]
  spec.email         = ["tangweiyuanyou@gmail.com"]

  spec.summary       = %q{cosy-jekyll-theme is a responsive and better reading experience blog template. No jQuery,And More concise,More geeks and Faster than other jekyll theme.}
  spec.homepage      = "https://github.com/tw93/tw93.github.io"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_runtime_dependency "jekyll", "~> 3.3"

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", "~> 10.0"
end
