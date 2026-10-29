# kramdown numbers every ordered list from 1 whatever the source says, so a
# list that continues across headings or past an unindented code block (6. 7. 8.
# under the next section) restarts at 1 on the page. This adds the start number
# kramdown understands before such a list, so posts stay plain Markdown that
# reads the same on GitHub, V2EX and the .md twins (kept from :post_read).
Jekyll::Hooks.register :documents, :pre_render do |doc|
  next unless %w[posts posts_en].include?(doc.collection.label)

  # A loose list has blank lines between its items, so only the last non-blank
  # line tells a new list from the next item of the same one.
  fenced = false
  previous = ''
  last_text = ''
  doc.content = doc.content.lines.map do |line|
    fenced = !fenced if line.lstrip.start_with?('```', '~~~')
    start = !fenced && previous.strip.empty? && last_text !~ /\A(\s|\d+\. |[-*+] )/ && line[/\A(\d+)\. /, 1]
    previous = line
    last_text = line unless line.strip.empty?
    start && start != '1' ? %({: start="#{start}"}\n#{line}) : line
  end.join
end
